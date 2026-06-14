window.addEventListener("DOMContentLoaded", () => {
    
    // Core Layout Toggles
    const menuToggleBtn = document.getElementById("menu-toggle-btn");
    const sidebarMenu = document.getElementById("sidebar-menu");
    
    // AI Assistant Toggles
    const aiMenuTrigger = document.getElementById("ai-menu-trigger");
    const aiChatPanel = document.getElementById("ai-chat-panel");
    const closeAiBtn = document.getElementById("close-ai-btn");
    const aiInputField = document.getElementById("ai-input-field");
    const aiSendBtn = document.getElementById("ai-send-btn");
    const chatStream = document.getElementById("chat-stream");
    const aiStatusPrompt = document.getElementById("ai-status-prompt");

    // All Navigation Element Targets
    const navDashboard = document.getElementById("nav-dashboard");
    const navPortfolio = document.getElementById("nav-portfolio");
    const navAssessments = document.getElementById("nav-assessments");
    const navHistory = document.getElementById("nav-history");
    const navFileAssessment = document.getElementById("nav-file-assessment");
    const navReceipt = document.getElementById("nav-receipt");
    const navGeneralHistory = document.getElementById("nav-general-history");
    const navSettings = document.getElementById("nav-settings"); 

    // All Pane Container Views
    const viewDashboard = document.getElementById("view-dashboard");
    const viewPortfolio = document.getElementById("view-portfolio");
    const viewAssessments = document.getElementById("view-assessments");
    const viewHistory = document.getElementById("view-history");
    const viewFileAssessment = document.getElementById("view-file-assessment");
    const viewReceipt = document.getElementById("view-receipt");
    const viewGeneralHistory = document.getElementById("view-general-history");
    const viewSettings = document.getElementById("view-settings");

    // Array mapped routing
    const routes = [
        { btn: navDashboard, view: viewDashboard },
        { btn: navPortfolio, view: viewPortfolio },
        { btn: navAssessments, view: viewAssessments },
        { btn: navHistory, view: viewHistory },
        { btn: navFileAssessment, view: viewFileAssessment },
        { btn: navReceipt, view: viewReceipt },
        { btn: navGeneralHistory, view: viewGeneralHistory },
        { btn: navSettings, view: viewSettings }
    ];

    // Toggle main sidebar
    if (menuToggleBtn && sidebarMenu) {
        menuToggleBtn.addEventListener("click", (e) => {
            e.preventDefault();
            sidebarMenu.classList.toggle("hidden");
        });
    }

    // Toggle AI sidebar
    if (aiMenuTrigger && aiChatPanel) {
        aiMenuTrigger.addEventListener("click", (e) => {
            e.preventDefault();
            aiChatPanel.classList.toggle("hidden");
        });
    }

    if (closeAiBtn && aiChatPanel) {
        closeAiBtn.addEventListener("click", (e) => {
            e.preventDefault();
            aiChatPanel.classList.add("hidden");
        });
    }

    // Routing Logic to clear views and set new active view
    function setRoute(activeRoute) {
        routes.forEach(route => {
            if (route.btn && route.view) {
                if (route === activeRoute) {
                    route.btn.classList.add("active");
                    route.view.classList.remove("hidden");
                } else {
                    route.btn.classList.remove("active");
                    route.view.classList.add("hidden");
                }
            }
        });
    }

    // Attach click listeners dynamically to all routes
    routes.forEach(route => {
        if (route.btn) {
            route.btn.addEventListener("click", (e) => {
                e.preventDefault();
                setRoute(route);
            });
        }
    });

    // =========================================================
    // REAL AI ASSISTANT API LOGIC 
    // =========================================================
    async function processUserMessage() {
        const textMessage = aiInputField.value.trim();
        if (!textMessage) return;

        // 1. Post User Message to UI
        const userBubble = document.createElement("div");
        userBubble.className = "chat-bubble user-msg";
        userBubble.textContent = textMessage;
        chatStream.insertBefore(userBubble, aiStatusPrompt);

        // 2. Clear input and show loading status
        aiInputField.value = "";
        aiInputField.disabled = true; // Prevent spam clicking
        chatStream.scrollTop = chatStream.scrollHeight;
        aiStatusPrompt.textContent = "AI is thinking...";

        try {
            // 3. Connect to your AI API
            // NOTE: This URL is set for a local Ollama instance running llama3.
            // If you use an Express backend or a different API (like Gemini), change the URL/body here!
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama3', // Change to your specific model name (e.g., 'llama3.2')
                    prompt: "You are a helpful local tax assistant for Pasay City. Answer briefly. User asks: " + textMessage,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // 4. Post AI Response to UI
            const botBubble = document.createElement("div");
            botBubble.className = "chat-bubble bot-msg";
            botBubble.textContent = data.response; // Make sure 'data.response' matches your API's output format
            chatStream.insertBefore(botBubble, aiStatusPrompt);

        } catch (error) {
            console.error("AI Connection Error:", error);
            
            // Render an error bubble if the API is unreachable
            const errorBubble = document.createElement("div");
            errorBubble.className = "chat-bubble bot-msg";
            errorBubble.style.color = "#FF6B6B";
            errorBubble.style.borderColor = "rgba(255, 107, 107, 0.3)";
            errorBubble.innerHTML = `<strong>Connection Error:</strong> Could not reach the AI server. Is your local API running?`;
            chatStream.insertBefore(errorBubble, aiStatusPrompt);
        } finally {
            // 5. Restore UI state
            aiInputField.disabled = false;
            aiInputField.focus();
            aiStatusPrompt.textContent = "How can I assist further?";
            chatStream.scrollTop = chatStream.scrollHeight;
        }
    }

    if (aiSendBtn) {
        aiSendBtn.addEventListener("click", processUserMessage);
    }

    if (aiInputField) {
        aiInputField.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !aiInputField.disabled) {
                processUserMessage();
            }
        });
    }

    // Settings Toggle Logic
    const toggles = document.querySelectorAll('.toggle-switch');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
});