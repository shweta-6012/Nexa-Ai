// =================================
// LOGIN AND REGISTER
// =================================


// Show Registration Form
function showRegister() {

    document.getElementById("loginForm").style.display = "none";

    document.getElementById("registerForm").style.display = "block";

}


// Show Login Form
function showLogin() {

    document.getElementById("registerForm").style.display = "none";

    document.getElementById("loginForm").style.display = "block";

}


// =================================
// LOGIN
// =================================

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginFormElement");

    if (loginForm) {

        loginForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const username = loginForm.querySelector(
                'input[name="username"]'
            ).value.trim();

            const password = loginForm.querySelector(
                'input[name="password"]'
            ).value;

            try {

                const response = await fetch("/api/login", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: username,
                        password: password
                    })

                });

                const data = await response.json();

                if (data.success) {

                    alert("Login Successful! Welcome to NexaAI.");
                    // After clicking OK, go to home page
                    window.location.href = "/";
                } else {

                    alert(data.message);

                }

            } catch (error) {

                alert("Unable to connect to the server.");

                console.error(error);

            }

        });

    }


    // =================================
    // REGISTER
    // =================================

    const registerForm = document.getElementById("registerFormElement");

    if (registerForm) {

        registerForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            const name = registerForm.querySelector(
                'input[name="fullname"]'
            ).value.trim();

            const email = registerForm.querySelector(
                'input[name="email"]'
            ).value.trim();

            const username = registerForm.querySelector(
                'input[name="username"]'
            ).value.trim();

            const password = registerForm.querySelector(
                'input[name="password"]'
            ).value;

            const confirmPassword = registerForm.querySelector(
                'input[name="confirm_password"]'
            ).value;


            // Check password
            if (password !== confirmPassword) {

                alert("Passwords do not match!");

                return;

            }


            // Check password length
            if (password.length < 8) {

                alert("Password must contain at least 8 characters!");

                return;

            }


            try {

                const response = await fetch("/api/register", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        name: name,

                        email: email,

                        password: password

                    })

                });

                const data = await response.json();


                if (data.success) {

                    alert("Registration Successful! Please Login.");

                    showLogin();

                } else {

                    alert(data.message);

                }

            } catch (error) {

                alert("Unable to connect to the server.");

                console.error(error);

            }

        });

    }


    // Start Chat button
    const startChatBtn = document.getElementById("startChatBtn");

    if (startChatBtn) {
        startChatBtn.addEventListener("click", function () {
            window.location.href = "/chatbot";
        });
    }

});

