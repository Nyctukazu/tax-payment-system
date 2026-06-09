import { initHeader } from './components/AppHeader.js';
import { initSidebar } from './components/AppSidebar.js';

document.addEventListener("DOMContentLoaded", () => {
    console.log("Global Backbone Initialized.");
    
    initHeader();
    initSidebar();
});

