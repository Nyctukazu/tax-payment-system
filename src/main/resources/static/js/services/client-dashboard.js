window.addEventListener("DOMContentLoaded", () => {
    
    const menuToggleBtn = document.getElementById("menu-toggle-btn");
    const sidebarMenu = document.getElementById("sidebar-menu");
    
    const aiMenuTrigger = document.getElementById("ai-menu-trigger");
    const aiChatPanel = document.getElementById("ai-chat-panel");
    const closeAiBtn = document.getElementById("close-ai-btn");

    const aiInputField = document.getElementById("ai-input-field");
    const aiSendBtn = document.getElementById("ai-send-btn");
    const chatStream = document.getElementById("chat-stream");
    const aiStatusPrompt = document.getElementById("ai-status-prompt");

    /* Navigation Element Targets */
    const navDashboard = document.getElementById("nav-dashboard");
    const navPortfolio = document.getElementById("nav-portfolio");
    const navAssessments = document.getElementById("nav-assessments");
    const navHistory = document.getElementById("nav-history");

    /* Pane Container Views */
    const viewDashboard = document.getElementById("view-dashboard");
    const viewPortfolio = document.getElementById("view-portfolio");
    const viewAssessments = document.getElementById("view-assessments");
    const viewHistory = document.getElementById("view-history");

    if (menuToggleBtn && sidebarMenu) {
        menuToggleBtn.addEventListener("click", (e) => {
            e.preventDefault();
            sidebarMenu.classList.toggle("hidden");
        });
    }

    if (aiMenuTrigger && aiChatPanel) {
        aiMenuTrigger.addEventListener("click", (e) => {
            e.preventDefault();
            aiChatPanel.classList.toggle("hidden");
            sidebarMenu.classList.add("hidden");
        });
    }

    if (closeAiBtn && aiChatPanel) {
        closeAiBtn.addEventListener("click", (e) => {
            e.preventDefault();
            aiChatPanel.classList.add("hidden");
        });
    }

    function clearActiveStates() {
        navDashboard.classList.remove("active");
        navPortfolio.classList.remove("active");
        navAssessments.classList.remove("active");
        if (navHistory) navHistory.classList.remove("active");

        viewDashboard.classList.add("hidden");
        viewPortfolio.classList.add("hidden");
        viewAssessments.classList.add("hidden");
        if (viewHistory) viewHistory.classList.add("hidden");
        
        sidebarMenu.classList.add("hidden");
    }

    if (navDashboard && viewDashboard) {
        navDashboard.addEventListener("click", (e) => {
            e.preventDefault();
            clearActiveStates();
            navDashboard.classList.add("active");
            viewDashboard.classList.remove("hidden");
        });
    }

    if (navPortfolio && viewPortfolio) {
        navPortfolio.addEventListener("click", (e) => {
            e.preventDefault();
            clearActiveStates();
            navPortfolio.classList.add("active");
            viewPortfolio.classList.remove("hidden");
        });
    }

    if (navAssessments && viewAssessments) {
        navAssessments.addEventListener("click", (e) => {
            e.preventDefault();
            clearActiveStates();
            navAssessments.classList.add("active");
            viewAssessments.classList.remove("hidden");
        });
    }

    if (navHistory && viewHistory) {
        navHistory.addEventListener("click", (e) => {
            e.preventDefault();
            clearActiveStates();
            navHistory.classList.add("active");
            viewHistory.classList.remove("hidden");
        });
    }

    function processUserMessage() {
        const textMessage = aiInputField.value.trim();
        if (!textMessage) return;

        const userBubble = document.createElement("div");
        userBubble.className = "chat-bubble user-msg";
        userBubble.textContent = textMessage;
        chatStream.insertBefore(userBubble, aiStatusPrompt);

        aiInputField.value = "";
        chatStream.scrollTop = chatStream.scrollHeight;

        aiStatusPrompt.textContent = "AI is thinking...";

        setTimeout(() => {
            const botBubble = document.createElement("div");
            botBubble.className = "chat-bubble bot-msg";
            botBubble.textContent = "I am processing your inquiry regarding: '" + textMessage + "'. Please let me know if you need specific computation steps for your Pasay tax assessment.";
            chatStream.insertBefore(botBubble, aiStatusPrompt);

            aiStatusPrompt.textContent = "How can I assist further?";
            chatStream.scrollTop = chatStream.scrollHeight;
        }, 1000);
    }

    if (aiSendBtn) {
        aiSendBtn.addEventListener("click", processUserMessage);
    }

    if (aiInputField) {
        aiInputField.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                processUserMessage();
            }
        });
    }
});
