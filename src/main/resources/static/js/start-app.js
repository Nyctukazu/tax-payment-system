import { initStartHeader } from "./components/StartHeader.js";
import { initializeParticles } from "./components/particles.js";
import { passwordValidator } from "./services/password-validation.js";

document.addEventListener("DOMContentLoaded", () => {
    passwordValidator();
    initializeParticles();
    initStartHeader();

});