🧠 Multilingual AI Assistant

An intelligent bilingual (Arabic / English) chatbot platform that allows users to have dynamic conversations with multiple AI models via OpenRouter.ai, securely managed through JWT authentication and built with Django (Backend) and React (Frontend).

📘 Overview

Multilingual AI Assistant is a full-stack application designed to provide a seamless multilingual chat experience powered by different AI models.
Users can sign up, log in securely, start conversations, generate summaries of all their past discussions, and switch between Arabic and English interfaces with automatic translations.

The system combines:

🧩 Django REST Framework for backend API management

⚛️ React + TailwindCSS + i18n for a responsive, multilingual frontend

🔐 JWT Authentication for secure access

🧠 AI integration via OpenRouter.ai to access:

Qwen (qwen3-30b-a3b)

Mistral (mistral-small-3.1-24b-instruct)

Gemma (gemma-3-27b-it)

⚙️ Features

🧩 Backend (Django)

User authentication with JWT (login, signup, logout)

Conversations and messages stored in SQLite database

AI response generation via OpenRouter (Qwen / Mistral / Gemma)

Automatic translation between English and Arabic

Automatic summary generation (model chosen by user)

Secure REST API endpoints with role-based access


💬 Frontend (React)

Multilingual interface (Arabic / English) using react-i18next

RTL (Right-to-Left) support for Arabic

Chat interface displaying user and model messages

Conversation list with pagination

Summary generation button

PDF export of conversation

responsive layout


🧑‍💻 Installation & Run

Clone the repository:

git clone https://github.com/<your-username>/Multilingual-AI-Assistant.git
cd chatbot_project

Backend Setup
cd Backend
python -m venv venv
source venv/Scripts/activate  # (Windows)
# or source venv/bin/activate  (Linux/macOS)

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

Frontend Setup
cd ../frontend
npm install
npm start


Or simply:

./run.sh
