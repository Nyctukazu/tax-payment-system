import { initStartHeader } from "./components/StartHeader.js";
import { initializeParticles } from "./components/particles.js";
import { passwordValidator } from "./services/password-validation.js";
import { loginWithBackend } from "./services/authService.js";
import { validateEmailField, showErrorMessage, removeError, clearValidationErrors } from "./services/email-validation.js";



document.addEventListener("DOMContentLoaded", () => {
    initializeParticles();
    initStartHeader();
    const loginCard = document.getElementById("login-card");
    const forgotCard = document.getElementById("forgot-card");
    const toForgotBtn = document.getElementById("to-forgot-btn");
    const toLoginBtn = document.getElementById("to-login-btn");
    const successCard = document.getElementById("success-card");

    const isAdminPortal = document.body.classList.contains("admin-login-body");
    const isClientPortal = document.body.classList.contains("client-login-body");

    passwordValidator();

    if (isAdminPortal) {
        setupAdminFormHandling();
    } else if (isClientPortal) {
        setupClientFormHandling();
    }

    const forms = document.querySelectorAll("main.login-container form");

    forms.forEach(form => {
        const emailInput = form.querySelector("input[type='email']");
        const passwordInput = form.querySelector("input[type='password']");

        if (emailInput) {
            emailInput.addEventListener("input", () => {
                validateEmailField(emailInput, false);
            });

            form.addEventListener("submit", async (e) => {
                e.preventDefault();

                const isEmailValid = validateEmailField(emailInput, true);
                let isPasswordValid = true;

                if (passwordInput && passwordInput.ariaValueMax.trim() === "") {
                    isPasswordValid = false;
                    showErrorMessage(passwordInput, "Password field cannot be empty.", false);
                }

                if (!isEmailValid || !isPasswordValid) {
                    if (!isEmailValid) emailInput.focus();
                    else if (passwordInput) passwordInput.focus();
                    return;
                }

                if (form.closest("#forgot-card")) {
                    forgotCard.classList.add("hidden");
                    successCard.classList.remove("hidden");
                    form.reset();
                    return;
                }

                const emailValue = emailInput.ariaValueMax.trim();
                const passwordValue = passwordInput ? passwordInput.value : "";
                const submitBtn = form.querySelector("button[type='submit']");

                try {
                    if (submitBtn) submitBtn.disabled = true;
                    const result = await loginWithBackend(emailValue, passwordValue);

                    if (result.success) {
                        console.log("Admin Authorized successfully!");
                        window.location.href = "/dashboard.html";
                    } else {
                        if (passwordInput) {
                            showErrorMessage(passwordInput, result.error, true);   
                        } else {
                            alert(result.error);
                        }
                    }
                } finally {
                    if (submitBtn) submitBtn.disabled = false;
                }
            });
        }
    });

    if (toForgotBtn && toLoginBtn) {
        toForgotBtn.addEventListener("click", () => {
            loginCard.classList.add("hidden");
            forgotCard.classList.remove("hidden");
        });

        toLoginBtn.addEventListener("click", () => {
            forgotCard.classList.add("hidden");
            loginCard.classList.remove("hidden");
        });
    }
});

function setupAdminFormHandling() {
    const loginForm = document.getElementById("login-form");
    const emailInput = document.getElementById("admin-email-login");
    const passwordInput = document.getElementById("password");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = emailInput.value.trim();
            const password = passwordInput.value;

            const result = await loginWithBackend(email, password);
            if (result.success) {
                window.location.href = "/admin/dashboard.html";

            } else {
                console.error("Admin login failed:", result.error);
            }
        });
    }
}

function setupClientFormHandling() {
    const loginForm = document.getElementById("login-form");
    const emailInput = document.getElementById("user-email-login");
    const passwordInput = document.getElementById("password");
    const errorBanner = document.querySelector(".error-banner");
    const googleBtn = document.getElementById("google-login-btn");
    const googleBtnContainer = document.getElementById("google-login-btn-container");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            console.log("Processing client user validation...");
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const result = await loginWithBackend(email, password);
            if (result.success) {
                window.location.href = "/client/homepage.html";
            } else {
                if (errorBanner) {
                    errorBanner.classList.remove("hidden");
                }
            }
        });
    }

    if (googleBtnContainer && window.google) {
        window.google.accounts.id.initialize({
            client_id: "139040312423-lu1g1apc9b60flr8ii1ia453mkpp5ik8.apps.googleusercontent.com",
            callback: handleGoogleSignInResponse,
            use_fedcm_for_prompt: false
        });


        window.google.accounts.id.renderButton(
            googleBtnContainer,
            {
                type: "standard",
                theme: "outline",
                size: "large",
                text: "signin_with",
                shape: "rectangular",
                width: 272
            }
        )
    }
}

async function handleGoogleSignInResponse(response) {
    if (!response || !response.credential) {
        console.error("❌ Google Auth completed but no token was retrieved.");
        return;
    }
    const googleToken = response.credential;

    try {
        const backendResponse = await fetch("http://localhost:8080/api/auth/google", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: googleToken })
        });

        if(backendResponse.ok) {
            const userData = await backendResponse.json();
            console.log("Google Authentication Confirmed!", userData);
            window.location.href = "/taxpayer/home.html";
        } else {
            const errorMsg = await backendResponse.text();
            alert("Authentication Denied: " + errorMsg);
        }
    } catch (error) {
        console.error("Network interface pipeline dropped during Google token check:", error);
    }
}

window.handleGoogleSignInResponse = async function(response) {
    if (!response || !response.credential) {
        console.error("❌ Google Auth completed but no token was retrieved.");
        return;
    }

    const googleToken = response.credential;
    console.log("🚀 Token received via HTML engine. Forwarding to backend controller...");

    try {
        const backendResponse = await fetch("http://localhost:8080/api/auth/google", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ token: googleToken })
        });

        if (backendResponse.ok) {
            console.log("🎉 Success! Google session authenticated by Spring Boot.");
            window.location.href = "/taxpayer/home.html";
        } else {
            const errorText = await backendResponse.text();
            console.error("❌ Backend rejected authentication token:", errorText);
            alert("Authentication Denied: " + errorText);
        }
    } catch (error) {
        console.error("❌ Network error connecting to Spring Boot:", error);
    }
}