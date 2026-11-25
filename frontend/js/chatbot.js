const sendBtn = document.getElementById("sendBtn");
const userMessage = document.getElementById("userMessage");
const chatMessages = document.getElementById("chatMessages");

const attachBtn = document.getElementById("attachBtn");
const pdfInput = document.getElementById("pdfInput");
const selectedFile = document.getElementById("selectedFile");
const fileName = document.getElementById("fileName");
const removeFile = document.getElementById("removeFile");

let attachedPDF = null;


// Open PDF selector
attachBtn.addEventListener("click", function () {
    pdfInput.click();
});


// Select PDF
pdfInput.addEventListener("change", function () {

    const file = pdfInput.files[0];

    if (!file) return;

    if (
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
    ) {
        alert("Please select a valid PDF file.");
        pdfInput.value = "";
        return;
    }

    if (file.size > 10 * 1024 * 1024) {
        alert("PDF size must be less than 10 MB.");
        pdfInput.value = "";
        return;
    }

    attachedPDF = file;

    fileName.textContent = "📄 " + file.name;
    selectedFile.hidden = false;

});


// Remove PDF
removeFile.addEventListener("click", function () {

    attachedPDF = null;
    pdfInput.value = "";
    selectedFile.hidden = true;

});


// Add chat message
function addMessage(content, className, markdown = false) {

    const div = document.createElement("div");

    div.className = className;

    if (markdown) {

        div.innerHTML = DOMPurify.sanitize(
            marked.parse(content)
        );

    } else {

        div.textContent = content;

    }

    chatMessages.appendChild(div);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    return div;
}


// Send message and PDF
async function sendMessage() {

    const message = userMessage.value.trim();

    if ((!message && !attachedPDF) || sendBtn.disabled) {
        return;
    }

    const currentPDF = attachedPDF;

    // Display user message
    if (message) {
        addMessage(message, "user-message");
    }

    if (currentPDF) {
        addMessage("📎 " + currentPDF.name, "user-message");
    }

    // Prepare FormData
    const formData = new FormData();

    formData.append("message", message);

    if (currentPDF) {
        formData.append("file", currentPDF);
    }

    userMessage.value = "";

    // Loading indicator
    const loadingDiv = addMessage(
        "NexaAI is analyzing your request...",
        "bot-message"
    );

    sendBtn.disabled = true;
    attachBtn.disabled = true;

    try {

        const response = await fetch("/api/chat", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Something went wrong."
            );
        }

        // Display formatted AI response
        loadingDiv.innerHTML = DOMPurify.sanitize(
            marked.parse(data.response)
        );

        // Clear PDF only after successful response
        if (attachedPDF === currentPDF) {
            attachedPDF = null;
            pdfInput.value = "";
            selectedFile.hidden = true;
        }

    } catch (error) {

        loadingDiv.textContent = "Error: " + error.message;

    } finally {

        sendBtn.disabled = false;
        attachBtn.disabled = false;

        userMessage.focus();

        chatMessages.scrollTop = chatMessages.scrollHeight;

    }

}


// Send button
sendBtn.addEventListener("click", sendMessage);


// Enter to send, Shift + Enter for new line
userMessage.addEventListener("keydown", function (event) {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        sendMessage();

    }

});
