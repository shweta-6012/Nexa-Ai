# Nexa-Ai 🤖
### Your AI-Powered Conversational Assistant

Nexa-Ai is an intelligent web-based assistant developed using **Python, Flask, and Generative AI**. It provides an interactive chat experience, allowing users to communicate with an AI model and interact with PDF documents through a simple web interface.

## Overview

Nexa-Ai combines backend development, frontend technologies, and AI integration to deliver a conversational application. It uses the Groq API to generate AI-powered responses and SQLite to manage user accounts and chat history.

## Key Features

- 💬 **AI Chat Assistant** – Get AI-generated responses through natural language conversations.
- 📄 **PDF Interaction** – Upload PDF documents and ask questions about their content.
- 🔐 **User Authentication** – Register and log in to access the application.
- 🗂️ **Chat History** – Save and retrieve previous conversations.
- ⚡ **AI Integration** – Connect with language models through the Groq API.
- 🎨 **Interactive UI** – Clean and user-friendly web interface.

## Technology Stack

| Technology | Purpose |
|---|---|
| Python | Core programming language |
| Flask | Backend web framework |
| HTML5 | Webpage structure |
| CSS3 | Styling and layout |
| JavaScript | Frontend interactivity |
| Groq API | AI response generation |
| LangChain | Language model integration |
| SQLite | Database management |
| PyPDF | PDF text extraction |

## Project Architecture

```text
Nexa-Ai/
│
├── backend/
│   ├── app.py
│   ├── chatmodels/
│   │   └── chat.py
│   └── database/
│       └── db.py
│
├── frontend/
│   ├── js/
│   │   ├── auth.js
│   │   ├── chatbot.js
│   │   └── particle-motion.js
│   ├── chatbot.html
│   ├── chatbot.css
│   ├── index.html
│   └── style.css
│
├── .gitignore
├── requirements.txt
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.10 or later
- pip
- Groq API key

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/shweta-6012/Nexa-Ai.git
```

**2. Open the project directory**

```bash
cd Nexa-Ai
```

**3. Create a virtual environment**

```bash
python -m venv .venv
```

**4. Activate the environment**

```bash
.venv\Scripts\activate
```

**5. Install dependencies**

```bash
pip install -r requirements.txt
```

**6. Configure your API key**

Create a `.env` file in the root directory and add:

```text
GROQ_API_KEY=your_groq_api_key
```

Keep your API key private. Never upload the `.env` file to GitHub.

**7. Start the application**

```bash
cd backend
python app.py
```

Open the local URL displayed in your terminal.

## Skills Demonstrated

- Python Programming
- Flask Web Development
- Frontend and Backend Integration
- Generative AI and LLM APIs
- Prompt Engineering
- PDF Processing
- Database Management
- Git and GitHub

## Developer

Shweta

Python Developer | Flask | Generative AI

[GitHub Profile](https://github.com/shweta-6012)

---

*Built as a hands-on project to explore web development and practical Generative AI integration.*
