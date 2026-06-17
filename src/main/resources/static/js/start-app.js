import { initStartHeader } from "./components/StartHeader.js";
import { initializeParticles } from "./components/particles.js";
import { passwordValidator } from "./services/password-validation.js";
import { loginWithBackend } from "./services/authService.js";
import { validateEmailField } from "./services/email-validation.js";

document.addEventListener("DOMContentLoaded", () => {
    initializeParticles();
    initStartHeader();
    
    const loginCard = document.getElementById("login-card");
    const forgotCard = document.getElementById("forgot-card");
    const toForgotBtn = document.getElementById("to-forgot-btn");
    const toLoginBtn = document.getElementById("to-login-btn");
    const successCard = document.getElementById("success-card");
    const loginForm = document.getElementById("login-form");
    const errorBanner = document.querySelector(".error-banner");

    const isAdminPortal = document.body.classList.contains("admin-login-body");
    passwordValidator();

    window.handleGoogleSignInResponse = async function(response) {
        if (!response || !response.credential) {
            console.error("❌ Google Auth completed but no token was retrieved.");
            return;
        }

        const googleToken = response.credential;
        console.log("🚀 Google Token received. Forwarding to backend controller...");

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
                const userData = await backendResponse.json();
                console.log("🎉 Success! Google session authenticated by Spring Boot.", userData);
                
                sessionStorage.setItem("userRole", "TAXPAYER"); 
                sessionStorage.setItem("userName", userData.firstName || "Citizen");

                window.location.href = "/client-dashboard";
            } else {
                let errorText = "Authentication Denied";
                try {
                    const errJson = await backendResponse.json();
                    errorText = errJson.error || errorText;
                } catch (e) {
                    errorText = await backendResponse.text();
                }
                console.error("❌ Backend rejected authentication token:", errorText);
                alert("Google Authentication Denied: " + errorText);
            }
        } catch (error) {
            console.error("❌ Network error connecting to Spring Boot:", error);
            alert("Unable to contact the authentication server. Please try again later.");
        }
    };

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            const emailInput = loginForm.querySelector("input[type='email']");
            const passwordInput = loginForm.querySelector("input[type='password']");
            const submitBtn = loginForm.querySelector("button[type='submit']");

            if (!emailInput || !passwordInput) return;

            const isEmailValid = validateEmailField(emailInput, true);
            const emailValue = emailInput.value.trim();
            const passwordValue = passwordInput.value;

            if (!isEmailValid) {
                emailInput.focus();
                return;
            }

            if (passwordValue === "") {
                showErrorMessage(passwordInput, "Password field cannot be empty.", false);
                passwordInput.focus();
                return;
            }

            try {
                if (submitBtn) submitBtn.disabled = true;
                if (errorBanner) errorBanner.classList.add("hidden");

                console.log(`Authenticating identity profile via email lookup...`);
                const result = await loginWithBackend(emailValue, passwordValue);

                if (result.success) {
                    const userRole = result.user.role || result.user.accountType; 
                    const displayName = result.user.displayName;
                    const adminClass = result.user.adminClass;

                    if (isAdminPortal && userRole !== "ADMIN") {
                        throw new Error("Access Denied: You do not possess administrator system authorization.");
                    }

                    sessionStorage.setItem("userRole", adminClass || userRole);
                    sessionStorage.setItem("userName", displayName);

                    if (userRole === "ADMIN") {
                        window.location.href = "/admin-dashboard";
                    } else {
                        window.location.href = "/client-dashboard";
                    }
                } else {
                    if (errorBanner) {
                        errorBanner.textContent = result.error;
                        errorBanner.classList.remove("hidden");
                    } else {
                        showErrorMessage(passwordInput, result.error, true);
                    }
                }
            } catch (error) {
                console.error("Portal login sequence aborted:", error.message);
                if (errorBanner) {
                    errorBanner.textContent = error.message;
                    errorBanner.classList.remove("hidden");
                }
            } finally {
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }

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

    const googleBtnContainer = document.getElementById("google-login-btn-container");
    if (googleBtnContainer && window.google) {
        window.google.accounts.id.initialize({
            client_id: "139040312423-lu1g1apc9b60flr8ii1ia453mkpp5ik8.apps.googleusercontent.com",
            callback: window.handleGoogleSignInResponse,
            use_fedcm_for_prompt: false
        });

        window.google.accounts.id.renderButton(googleBtnContainer, {
            type: "standard",
            theme: "outline",
            size: "large",
            text: "signin_with",
            shape: "rectangular",
            width: 272
        });
    }
});
