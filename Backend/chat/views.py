from django.shortcuts import render

from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_datetime
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Conversation, Message
from users.models import User
from .ai_utils import qwen, mistral, gemma, gemma_summary, mistral_summary, qwen_summary
from rest_framework.permissions import IsAuthenticated


# GET /conversations/{user_id}/{before_date}

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_conversations(request, user_id, before_date=None):
    """
    Retourne 10 conversations max d'un user, triées par updated_at décroissant.
    Si before_date est fourni → conversations avant cette date.
    Sinon → conversations récentes.
    """

    # Filtrage par date si fourni
    qs = Conversation.objects.filter(user_id=user_id)

    if before_date and before_date != "null":
        date_obj = parse_datetime(before_date)
        if not date_obj:
            return Response({"error": "Invalid date format. Use ISO 8601 (YYYY-MM-DDTHH:MM:SSZ)"}, status=400)
        qs = qs.filter(updated_at__lt=date_obj)

    qs = qs.order_by("-updated_at")[:10]

    data = [
        {
            "id": conv.id,
            "title_en": conv.title_en,
            "title_ar": conv.title_ar,
            "created_at": conv.created_at,
            "updated_at": conv.updated_at,
        }
        for conv in qs
    ]

    return Response(data, status=200)



# GET /conversation/{id}
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_conversation(request, pk):
    """
    Retourne tous les messages d'une conversation, triés par created_at.
    """
    conversation = get_object_or_404(Conversation, pk=pk)
    messages = conversation.messages.all().order_by("created_at")

    data = [
        {
            "id": msg.id,
            "author": msg.author,
            "msg_en": msg.msg_en,
            "msg_ar": msg.msg_ar,
            "translated": msg.translated,
            "created_at": msg.created_at,
        }
        for msg in messages
    ]

    return Response({"conversation_id": pk, "messages": data}, status=200)


# DELETE /conversations/{id}
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_conversation(request, pk):
    """
    Supprime une conversation et tous ses messages.
    """
    conversation = get_object_or_404(Conversation, pk=pk)
    conversation.delete()
    return Response({"message": "Conversation deleted successfully"}, status=204)


# DELETE /messages/{id}
@api_view(["DELETE"])
def delete_message(request, pk):
    """
    Supprime un message.
    """
    message = get_object_or_404(Message, pk=pk)
    message.delete()
    return Response({"message": "Message deleted successfully"}, status=204)

@api_view(["POST"])
def generate_response(request):
    """
    API qui génère une réponse avec le modèle choisi.
    Params attendus :
    - conversation (historique: liste de {role: user/assistant, content: ...})
    - prompt (texte du user)
    - model (qwen/mistral/gemma)
    - conversation_id (nullable)
    - language (ar/en)
    - user_id
    """

    data = request.data
    conversation_history = data.get("conversation", [])
    prompt = data.get("prompt")
    model = data.get("model")
    conversation_id = data.get("conversation_id")
    language = data.get("language", "en")
    user_id = data.get("user_id")

    if not prompt or not model:
        return Response({"error": "Missing prompt or model"}, status=status.HTTP_400_BAD_REQUEST)

    user = get_object_or_404(User, id=user_id)

    model_map = {
        "qwen": qwen,
        "mistral": mistral,
        "gemma": gemma,
    }
    model_func = model_map.get(model)
    if not model_func:
        return Response({"error": f"Model {model} not supported"}, status=400)

    #  traduire le prompt 
    prompt_en = prompt
    prompt_ar = prompt
    if language == "en":
        prompt_ar = model_func(prompt, translation=True, language="en", gen_title=False)
    else:
        prompt_en = model_func(prompt, translation=True, language="ar", gen_title=False)

    #  générer la réponse 
    conversation_input = conversation_history + [{"role": "user", "content": prompt}]
    response_text = model_func(conversation_input, translation=False, language=language, gen_title=False)

    # traduire la réponse
    response_en = response_text
    response_ar = response_text
    if language == "en":
        response_ar = model_func(response_text, translation=True, language="en", gen_title=False)
    else:
        response_en = model_func(response_text, translation=True, language="ar", gen_title=False)

    # si conversation_id est null → créer une nouvelle conversation 
    if not conversation_id:
        # générer un titre anglais
        title_en = model_func(prompt_en, translation=False, language="en", gen_title=True)
        # traduire le titre
        title_ar = model_func(title_en, translation=True, language="en", gen_title=False)

        conversation = Conversation.objects.create(
            user=user, 
            title_en=title_en,
            title_ar=title_ar,
        )
        conversation_id = conversation.id
    else:
        conversation = get_object_or_404(Conversation, id=conversation_id, user=user)

    # sauvegarder prompt 
    user_msg = Message.objects.create(
        conversation=conversation,
        author="user",
        msg_en=prompt_en,
        msg_ar=prompt_ar,
        translated=True,
    )

    # sauvegarder réponse 
    ai_msg = Message.objects.create(
        conversation=conversation,
        author=model,
        msg_en=response_en,
        msg_ar=response_ar,
        translated=True,
    )
    #  mettre à jour le champ updated_at 
    conversation.save()

    return Response(
        {
            "conversation_id": conversation_id,
            "messages": [{"id": user_msg.id, 
                          "author": "user", 
                          "msg_en": user_msg.msg_en, 
                          "msg_ar": user_msg.msg_ar,
                          "created_at": user_msg.created_at},
                          {"id": ai_msg.id, 
                          "author": model, 
                          "msg_en": ai_msg.msg_en, 
                          "msg_ar": ai_msg.msg_ar,
                          "created_at": ai_msg.created_at}]
        },
        status=200,
    )


@api_view(["POST"])
def generate_summary(request):
    """
    Génère un résumé global pour un utilisateur à partir de toutes ses conversations.
    Params attendus :
    - user_id
    """

    user_id = request.data.get("user_id")
    model = request.data.get("model")
    if not user_id:
        return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    user = get_object_or_404(User, id=user_id)

    # Récupérer tous les messages de l'utilisateur
    conversations = Conversation.objects.filter(user=user).prefetch_related("messages")

    if not conversations.exists():
        return Response({"error": "No conversations found for this user."}, status=404)

    # Concaténer tout le texte anglais + arabe
    all_text = ""
    for conv in conversations:
        for msg in conv.messages.all().order_by("created_at"):
            # Inclure auteur et texte pour contexte
            author = "User" if msg.author == "user" else msg.author.capitalize()
            content = msg.msg_en
            all_text += f"{author}: {content}\n"

    if not all_text.strip():
        return Response({"error": "No message content found for this user."}, status=404)

    # Générer le résumé avec Qwen
    if model == "qwen":
        summary_en, summary_ar = qwen_summary(all_text)
    elif model == "gemma":
        summary_en, summary_ar = gemma_summary(all_text)
    else:
        summary_en, summary_ar = mistral_summary(all_text)


    # Mettre à jour le champ summary_en dans le modèle User
    user.summary_en = summary_en
    user.summary_ar = summary_ar
    user.save()

    return Response(
        {
            "message": "Summary generated successfully",
            "summary_en": summary_en,
            "summary_ar": summary_ar,
        },
        status=200,
    )