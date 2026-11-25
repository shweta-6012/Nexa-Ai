import os
from flask import Flask, request, jsonify,send_from_directory
import smtplib
from email.message import EmailMessage
from pypdf import PdfReader  
import pypdf.errors  
from io import BytesIO
import logging

from chatmodels.chat import generate_response
from database.db import create_tables, save_chat, register_user, login_user

# Flask configuration
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")

app = Flask(
    __name__,
    static_folder=FRONTEND_DIR,
    static_url_path=""
)

# Maximum PDF size: 10 MB
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024

# Initialize the database when the app is imported (including by WSGI servers).
create_tables()


# Open homepage
@app.route("/")
def home():
    return send_from_directory(FRONTEND_DIR, "index.html")


# Open chatbot page
@app.route("/chatbot")
def chatbot():
    return send_from_directory(FRONTEND_DIR, "chatbot.html")

@app.route("/contact", methods=["POST"])
def contact():
    name = request.form.get("name", "").strip()
    email = request.form.get("email", "").strip()
    message = request.form.get("message", "").strip()

    if not name or not email or not message:
        return "Please fill all fields.", 400

    try:
        msg = EmailMessage()

        msg["Subject"] = f"NexaAI Contact Message from {name}"
        msg["From"] = os.environ["MAIL_USERNAME"]
        msg["To"] = os.environ["OWNER_EMAIL"]
        msg["Reply-To"] = email

        msg.set_content(
            f"""New message received from NexaAI website.

Name: {name}
Email: {email}

Message:
{message}
"""
        )

       with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=15) as smtp:
            smtp.login(os.environ["MAIL_USERNAME"], os.environ["MAIL_PASSWORD"])
            smtp.send_message(msg)

        return """
        <script>
            alert("Message sent successfully!");
            window.location.href = "/";
        </script>
        """

    except Exception as e:
        print("Email error:", e)
        return """
        <script>
            alert("Unable to send message. Please try again later.");
            window.location.href = "/";
        </script>
        """, 500


# Extract PDF text
def extract_pdf_text(pdf_file):

    pdf_bytes = BytesIO(pdf_file.read())

    try:
        reader = PdfReader(pdf_bytes)
        if reader.is_encrypted:
            raise ValueError("Password-protected PDFs are not supported.")

        extracted_text = []

        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                extracted_text.append(page_text)

        report_text = "\n".join(extracted_text).strip()
    except ValueError:
        raise
    except (pypdf.errors.PyPdfError, EOFError) as error:
        raise ValueError("The uploaded PDF is invalid or unreadable.") from error

    if not report_text:
        raise ValueError(
            "No readable text found in PDF. Scanned PDFs require OCR."
        )

    return report_text


# GenAI Chat API
@app.route("/api/chat", methods=["POST"])
def chat():

    # Receive FormData
    user_message = request.form.get("message", "").strip()

    pdf_file = request.files.get("file")

    # Allow message-only or PDF-only requests
    if not user_message and not pdf_file:
        return jsonify({
            "error": "Please enter a message or attach a PDF."
        }), 400

    try:

        final_prompt = user_message

        # Process PDF attachment
        if pdf_file:

            if not pdf_file.filename:
                return jsonify({
                    "error": "Please select a PDF file."
                }), 400

            if not pdf_file.filename.lower().endswith(".pdf"):
                return jsonify({
                    "error": "Only PDF files are allowed."
                }), 400

            report_text = extract_pdf_text(pdf_file)

            # Default question for PDF-only uploads
            if not user_message:
                user_message = "Please analyze this medical report."

            final_prompt = f"""
You are NexaAI, a medical report analysis assistant.

Analyze the uploaded medical report and answer the user's question.

MEDICAL REPORT:
{report_text[:50000]}

USER QUESTION:
{user_message}

IMPORTANT INSTRUCTIONS:

1. Extract only information available in the report.
2. Do not invent patient details, test results, units, or reference ranges.
3. Identify abnormal results using the reference ranges provided.
4. If a reference range is missing, clearly state that it was not provided.
5. Explain medical terminology in simple language.
6. Do not provide a definitive diagnosis.
7. Do not prescribe medication.
8. Recommend consulting a qualified healthcare professional.
9. Use Markdown headings, lists, and tables where appropriate.
"""

        # Generate AI response using Groq
        ai_response = generate_response(final_prompt)

        # Save conversation in SQLite
        save_chat(user_message, ai_response)

        return jsonify({
            "response": ai_response
        })

    except ValueError as error:

        return jsonify({
            "error": str(error)
        }), 400

    except Exception:

        logging.exception("Error processing chat request")

        return jsonify({
            "error": "Unable to process your request. Please try again."
        }), 500


# Handle oversized PDF
@app.errorhandler(413)
def file_too_large(error):

    return jsonify({
        "error": "PDF size exceeds the 10 MB limit."
    }), 413



# register user API
@app.route("/api/register", methods=["POST"])
def register():

    data = request.get_json()

    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not name or not email or not password:
        return jsonify({
            "success": False,
            "message": "Please fill all fields."
        }), 400

    user_created = register_user(name, email, password)

    if not user_created:
        return jsonify({
            "success": False,
            "message": "Account already exists. Please login."
        }), 409

    return jsonify({
        "success": True,
        "message": "Registration successful!"
    })


# login user API
@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Please enter email and password."
        }), 400

    user = login_user(email, password)

    if not user:
        return jsonify({
            "success": False,
            "message": "Invalid email or password. Please register if you don't have an account."
        }), 401

    return jsonify({
        "success": True,
        "message": "Login successful!",
        "user": user
    })


# Run application
if __name__ == "__main__":

    create_tables()

    app.run(debug=False)




