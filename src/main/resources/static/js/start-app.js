import { initStartHeader } from "./components/StartHeader.js";
import { initializeParticles } from "./components/particles.js";
import { passwordValidator } from "./services/password-validation.js";
import { loginWithBackend, loginWithGoogleBackend, registerAdminWithBackend, RegisterUserWithBackend } from "./services/authService.js";
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

        const result = await loginWithGoogleBackend(response.credential);

        if (result.success) {
            console.log("✅ Backend authentication successful. Redirecting...");
            
            if (result.user && result.user.token) {
                document.cookie = `authToken=${result.user.token}; path=/; max-age=28800; Secure; SameSite=Strict`;
                localStorage.setItem("authToken", result.user.token);
            }
            const urlSafeName = response.user.displayName.toLowerCase().replace(/\s+/g, '-'); 
            window.location.href = `/client-dashboard/${urlSafeName}`;
        } else {
            console.error("❌ Pasay Tax System Auth failed:", result.error);
            alert("Authentication failed: " + result.error);
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
                    document.cookie = `authToken=${result.user.token}; path=/; max-age=28800; Secure; SameSite=Strict`;
                    localStorage.setItem("currentUser", JSON.stringify(result.user));


                    if (isAdminPortal && userRole !== "ADMIN") {
                        throw new Error("Access Denied: You do not possess administrator system authorization.");
                    }

                    const urlSafeName = displayName.toLowerCase().replace(/\s+/g, '-'); 
                    sessionStorage.setItem("userRole", adminClass || userRole);
                    sessionStorage.setItem("userName", displayName);


                    if (userRole === "ADMIN") {
                        window.location.href = `/admin-dashboard/${urlSafeName}`;
                    } else {
                        window.location.href = `/client-dashboard/${urlSafeName}`;
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
