import { initStartHeader } from "./components/StartHeader.js";
import { initializeParticles } from "./components/particles.js";
import { passwordValidator } from "./services/password-validation.js";
import { loginWithBackend } from "./services/authService.js";
import { validateEmailField, showErrorMessage, removeError, clearValidationErrors } from "./services/email-validation.js";

document.addEventListener("DOMContentLoaded", () => {
    initializeParticles();
    initStartHeader();
});

document.addEventListener("DOMContentLoaded", () => {
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