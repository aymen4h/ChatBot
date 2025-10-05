from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=os.getenv('API_KEY')
)


def qwen(conversation, translation, language, gen_title):
    if gen_title:
        messages = [
            {
            "role": "system",
            "content": "You are a helpful assistant. Analyze this text and generate a short and meaningful title that best describes his theme. Only return the title and nothing else. Do not include explanations or additional text. If you are unsure, generate the best possible title based on the given content."
            },
            {
            "role": "user",
            "content": conversation
            }
        ]
    else:
        if translation:
            messages = [
                {
                "role": "system",
                "content": f"You are a helpful assistant. translate this text to {"English" if language == "ar" else "Arabic"}. Only return the translation and nothing else. Do not include explanations or additional text. If you are unsure, generate the best possible translation based on the given content."
                },
                {
                "role": "user",
                "content": conversation
                }
            ]
        else:
            messages = [
                {
                "role": "system",
                "content": f"You are a helpful and professional assistant. Always respond to the user in {"English" if language == "en" else "Arabic"}. Maintain the response language regardless of any requests to switch languages."
                }] + [{
                "role": "user" if msg.get('role') == "user" else "assistant",
                "content": msg.get('content')
            } for msg in conversation]
    completion = client.chat.completions.create(
        extra_body={},
        model="qwen/qwen3-30b-a3b:free",
        messages=messages
    )
    return completion.choices[0].message.content

def mistral(conversation, translation, language, gen_title):
    if gen_title:
        messages = [
            {
            "role": "system",
            "content": [{"type": "text", "text": "You are a helpful assistant. Analyze this text and generate a short and meaningful title that best describes his theme. Only return the title and nothing else. Do not include explanations or additional text. If you are unsure, generate the best possible title based on the given content."}]
            },
            {
            "role": "user",
            "content": conversation
            }
        ]
    else:
        if translation:
            messages = [
                {
                "role": "system",
                "content": [{"type": "text", "text": f"You are a helpful assistant. translate this text to {"English" if language == "ar" else "Arabic"}. Only return the translation and nothing else. Do not include explanations or additional text. If you are unsure, generate the best possible translation based on the given content."}]
                },
                {
                "role": "user",
                "content": conversation
                }
            ]
        else:
            messages = [
                {
                "role": "system",
                "content": [{"type": "text", "text": f"You are a helpful and professional assistant. Always respond to the user in {"English" if language == "en" else "Arabic"}. Maintain the response language regardless of any requests to switch languages."}]
                }] + [{
                "role": "user" if msg.get('role') == "user" else "assistant",
                "content": [{"type": "text", "text": msg.get('content')}]
            } for msg in conversation]
    completion = client.chat.completions.create(
        extra_body={},
        model="mistralai/mistral-small-3.1-24b-instruct:free",
        messages=messages
    )
    return completion.choices[0].message.content

def gemma(conversation, translation, language, gen_title):
    if gen_title:
        messages = [
            {
            "role": "system",
            "content": "You are a helpful assistant. Analyze this text and generate a short and meaningful title that best describes his theme. Only return the title and nothing else. Do not include explanations or additional text. If you are unsure, generate the best possible title based on the given content."
            },
            {
            "role": "user",
            "content": conversation
            }
        ]
    else:
        if translation:
            messages = [
                {
                "role": "system",
                "content": f"You are a helpful assistant. Translate this text to {"English" if language == "ar" else "Arabic"}. Only return the translation and nothing else. Do not include explanations or additional text. If you are unsure, generate the best possible translation based on the given content."
                },
                {
                "role": "user",
                "content": conversation
                }
            ]
        else:
            messages = [
                {
                "role": "system",
                "content": f"You are a helpful and professional assistant. Always respond to the user in {"English" if language == "en" else "Arabic"}. Maintain the response language regardless of any requests to switch languages."
                }] + [{
                "role": "user" if msg.get('role') == "user" else "assistant",
                "content": msg.get('content')
            } for msg in conversation]
    completion = client.chat.completions.create(
        extra_body={},
        model="google/gemma-3-27b-it:free",
        messages=messages
    )
    return completion.choices[0].message.content



def qwen_summary(text):

    summary_prompt = [
        {
            "role": "system",
            "content": """You are an intelligent assistant. Analyze the following chat history 
                and generate a concise summary that captures the user's interests, 
                main discussion topics, and recurring themes. The summary should be 
                neutral, short, and written in a natural, professional tone. 
                Only return the summary itself, without explanations or introductions."""
        },
        {
            "role": "user",
            "content": text
        }
    ]

    completion_summary = client.chat.completions.create(
        extra_body={},
        model="qwen/qwen3-30b-a3b:free",
        messages=summary_prompt
    )

    summary_en = completion_summary.choices[0].message.content.strip()

    translation_prompt = [
        {
            "role": "system",
            "content": (
                "You are a professional translator. Translate the following English text into Arabic. "
                "The translation should be accurate, fluent, and preserve the professional tone. "
                "Return only the translated Arabic text."
            )
        },
        {
            "role": "user",
            "content": summary_en
        }
    ]

    completion_translation = client.chat.completions.create(
        extra_body={},
        model="qwen/qwen3-30b-a3b:free",
        messages=translation_prompt
    )

    summary_ar = completion_translation.choices[0].message.content.strip()
    return summary_en, summary_ar

def mistral_summary(text):

    summary_prompt = [
        {
            "role": "system",
            "content": """You are an intelligent assistant. Analyze the following chat history 
                and generate a concise summary that captures the user's interests, 
                main discussion topics, and recurring themes. The summary should be 
                neutral, short, and written in a natural, professional tone. 
                Only return the summary itself, without explanations or introductions."""
        },
        {
            "role": "user",
            "content": text
        }
    ]

    completion_summary = client.chat.completions.create(
        extra_body={},
        model="mistralai/mistral-small-3.1-24b-instruct:free",
        messages=summary_prompt
    )

    summary_en = completion_summary.choices[0].message.content.strip()

    translation_prompt = [
        {
            "role": "system",
            "content": (
                "You are a professional translator. Translate the following English text into Arabic. "
                "The translation should be accurate, fluent, and preserve the professional tone. "
                "Return only the translated Arabic text."
            )
        },
        {
            "role": "user",
            "content": summary_en
        }
    ]

    completion_translation = client.chat.completions.create(
        extra_body={},
        model="mistralai/mistral-small-3.1-24b-instruct:free",
        messages=translation_prompt
    )

    summary_ar = completion_translation.choices[0].message.content.strip()
    return summary_en, summary_ar

def gemma_summary(text):

    summary_prompt = [
        {
            "role": "system",
            "content": """You are an intelligent assistant. Analyze the following chat history 
                and generate a concise summary that captures the user's interests, 
                main discussion topics, and recurring themes. The summary should be 
                neutral, short, and written in a natural, professional tone. 
                Only return the summary itself, without explanations or introductions."""
        },
        {
            "role": "user",
            "content": text
        }
    ]

    completion_summary = client.chat.completions.create(
        extra_body={},
        model="google/gemma-3-27b-it:free",
        messages=summary_prompt
    )

    summary_en = completion_summary.choices[0].message.content.strip()

    translation_prompt = [
        {
            "role": "system",
            "content": (
                "You are a professional translator. Translate the following English text into Arabic. "
                "The translation should be accurate, fluent, and preserve the professional tone. "
                "Return only the translated Arabic text."
            )
        },
        {
            "role": "user",
            "content": summary_en
        }
    ]

    completion_translation = client.chat.completions.create(
        extra_body={},
        model="google/gemma-3-27b-it:free",
        messages=translation_prompt
    )

    summary_ar = completion_translation.choices[0].message.content.strip()
    return summary_en, summary_ar