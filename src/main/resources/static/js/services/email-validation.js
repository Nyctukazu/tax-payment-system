// 1. Core utilities placed at the top so they are defined first
export function removeError(input, errorContainer) {
    if (errorContainer) {
        errorContainer.remove();
    }
    input.classList.remove("input-error", "auth-denied");
}

export function showErrorMessage(input, message, isAuthError = false) {
    let errorContainer = input.parentElement.querySelector(".validation-error-msg");
    if (!errorContainer) {
        errorContainer = document.createElement("span");
        errorContainer.className = "validation-error-msg";
        input.parentElement.appendChild(errorContainer);
    }
    errorContainer.textContent = message;
    
    if (isAuthError) {
        errorContainer.classList.add("auth-denied");
        input.classList.add("input-error", "auth-denied");
    } else {
        errorContainer.classList.remove("auth-denied");
        input.classList.remove("auth-denied");
        input.classList.add("input-error");
    }
}

export function clearValidationErrors() {
    document.querySelectorAll(".validation-error-msg").forEach(msg => msg.remove());
    document.querySelectorAll(".input-error").forEach(input => {
        input.classList.remove("input-error", "auth-denied");
    });
}

export function validateEmailField(input) {
    const emailValue = input.value.trim();
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let errorContainer = input.parentElement.querySelector(".validation-error-msg");

    if (emailValue === "") {
        removeError(input, errorContainer);
        return false;
    }

    if (!emailPattern.test(emailValue)) {
        showErrorMessage(input, "Please enter a valid email address format.", false);
        return false;
    }

    removeError(input, errorContainer);
    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    const loginCard = document.getElementById("login-card");
    const forgotCard = document.getElementById("forgot-card");
    const successCard = document.getElementById("success-card");
    
    const toForgotBtn = document.getElementById("to-forgot-btn");
    const toLoginBtn = document.getElementById("to-login-btn");
    const toLoginFromSuccessBtn = document.getElementById("to-login-from-success-btn");

    if (toForgotBtn && toLoginBtn) {
        toForgotBtn.addEventListener("click", () => {
            loginCard.classList.add("hidden");
            forgotCard.classList.remove("hidden");
            successCard.classList.add("hidden");
            clearValidationErrors();
        });

        toLoginBtn.addEventListener("click", () => {
            forgotCard.classList.add("hidden");
            successCard.classList.add("hidden");
            loginCard.classList.remove("hidden");
            clearValidationErrors();
        });
    }

    if (toLoginFromSuccessBtn) {
        toLoginFromSuccessBtn.addEventListener("click", () => {
            successCard.classList.add("hidden");
            forgotCard.classList.add("hidden");
            loginCard.classList.remove("hidden");
            clearValidationErrors();
        });
    }
});
