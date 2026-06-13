import { initClientHeader } from './components/AppHeader.js';
import { initClientSidebar } from './components/AppSidebar.js';
import { initializeParticles } from "./components/particles.js";
import { passwordValidator } from "./services/password-validation.js";

document.addEventListener("DOMContentLoaded", () => {
    console.log("Global Backbone Initialized.");
    passwordValidator();
    initializeParticles();
    initClientHeader();
    initClientSidebar();
});

