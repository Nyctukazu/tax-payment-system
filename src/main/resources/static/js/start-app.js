import { initStartHeader } from "./components/StartHeader.js";
import { initializeParticles } from "./components/particles.js";
import { passwordValidator } from "./services/password-validation.js";

document.addEventListener("DOMContentLoaded", () => {
    passwordValidator();
    initializeParticles();
    initStartHeader();

});

document.addEventListener("DOMContentLoaded", () => {
    const loginCard = document.getElementById("login-card");
    const forgotCard = document.getElementById("forgot-card");
    const toForgotBtn = document.getElementById("to-forgot-btn");
    const toLoginBtn = document.getElementById("to-login-btn");

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

