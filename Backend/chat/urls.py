from django.urls import path
from . import views

urlpatterns = [
    path("conversations/<int:pk>/delete/", views.delete_conversation, name="delete_conversation"),
    path("messages/<int:pk>/delete/", views.delete_message, name="delete_message"),
    path("conversation/<int:pk>/", views.get_conversation, name="get_conversation"),
    path("generate-response/", views.generate_response, name="generate_response"),
    path("generate-summary/", views.generate_summary, name="generate_summary"),
    path("conversations/<int:user_id>/<str:before_date>/", views.get_conversations, name="get_conversations"),
    path("conversations/<int:user_id>/", views.get_conversations, name="get_recent_conversations"),
]
