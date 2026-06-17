import { initClientHeader } from "../components/AppHeader.js";
import { initClientSidebar } from "../components/AppSidebar.js";
import { initAIPanel } from "../components/AIPanel.js";

window.addEventListener("DOMContentLoaded", () => {
    initClientHeader();
    initClientSidebar();
    initAIPanel();
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
    const viewCreateApplication = document.getElementById("view-create-application"); // New View

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
        // Ensure the create application view is hidden when using standard nav
        if (viewCreateApplication) {
            viewCreateApplication.classList.add("hidden");
        }

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

    // --- Receipt Link Navigation Logic ---
    const receiptLinks = document.querySelectorAll(".rcpt-link");
    if (receiptLinks.length > 0) {
        receiptLinks.forEach(link => {
            link.addEventListener("click", (e) => {
                e.preventDefault();
                setRoute(routes.find(r => r.btn === navReceipt));
            });
        });
    }

    // --- Create Application Navigation Logic ---
    const btnCreateApp = document.getElementById("btn-create-app");

    if (btnCreateApp && viewCreateApplication) {
        btnCreateApp.addEventListener("click", (e) => {
            e.preventDefault();
            
            // Hide all standard views first
            routes.forEach(route => {
                if (route.view) {
                    route.view.classList.add("hidden");
                }
            });
            
            // Show the new Create Application view
            viewCreateApplication.classList.remove("hidden");
            
            // Keep the "Tax Assessments" sidebar link highlighted
            navAssessments.classList.add("active");
        });
    }

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
            const response = await fetch('http://localhost:11434/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama3', 
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
            botBubble.textContent = data.response; 
            chatStream.insertBefore(botBubble, aiStatusPrompt);

        } catch (error) {
            console.error("AI Connection Error:", error);
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

    // =========================================================
    // ENHANCED FORM DATA VALIDATIONS
    // =========================================================

    // Utility function to handle displaying/hiding errors
    function toggleError(inputId, errorId, isInvalid, customMsg = null) {
        const inputEl = document.getElementById(inputId);
        const errorEl = document.getElementById(errorId);
        if (!inputEl || !errorEl) return;

        if (isInvalid) {
            inputEl.classList.add("input-error");
            errorEl.classList.remove("hidden");
            if (customMsg) errorEl.textContent = customMsg;
        } else {
            inputEl.classList.remove("input-error");
            errorEl.classList.add("hidden");
        }
    }

    // 1. Settings Form Validation
    const btnSaveSettings = document.getElementById("btn-save-settings");
    if (btnSaveSettings) {
        btnSaveSettings.addEventListener("click", (e) => {
            e.preventDefault();
            let isValid = true;

            // Validate Name (Required, > 2 chars, letters and spaces only)
            const nameVal = document.getElementById("set-name").value.trim();
            const nameRegex = /^[A-Za-zÑñ\s\-\.]{3,50}$/;
            if (!nameRegex.test(nameVal)) {
                toggleError("set-name", "err-set-name", true, "Name must be 3-50 letters/spaces.");
                isValid = false;
            } else {
                toggleError("set-name", "err-set-name", false);
            }

            // Validate Email (Strict Regex check)
            const emailVal = document.getElementById("set-email").value.trim();
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(emailVal)) {
                toggleError("set-email", "err-set-email", true, "Please enter a valid email format.");
                isValid = false;
            } else {
                toggleError("set-email", "err-set-email", false);
            }

            // Validate Phone (Philippine Mobile Format check)
            const phoneVal = document.getElementById("set-phone").value.replace(/\s+/g, '');
            const phoneRegex = /^(09|\+639)\d{9}$/;
            if (!phoneRegex.test(phoneVal)) {
                toggleError("set-phone", "err-set-phone", true, "Enter a valid PH number (+639... or 09...).");
                isValid = false;
            } else {
                toggleError("set-phone", "err-set-phone", false);
            }

            if (isValid) {
                alert("Settings successfully saved!"); 
                btnSaveSettings.textContent = "Saved ✓";
                setTimeout(() => btnSaveSettings.textContent = "Save Settings", 2000);
            }
        });
    }

    // 2. Create Application Validation
    const btnSubmitApp = document.getElementById("btn-submit-app");
    const dropzone = document.getElementById("app-dropzone");
    let fileUploaded = false;

    // Simulate file upload click on dropzone
    if (dropzone) {
        dropzone.addEventListener("click", () => {
            fileUploaded = true;
            dropzone.classList.add("has-file");
            dropzone.classList.remove("input-error");
            document.getElementById("err-app-dropzone").classList.add("hidden");
            document.getElementById("dropzone-icon").className = "fa-solid fa-file-circle-check";
            document.getElementById("dropzone-text").textContent = "Financial_Statement_2024.pdf attached";
        });
    }

    if (btnSubmitApp) {
        btnSubmitApp.addEventListener("click", (e) => {
            e.preventDefault();
            let isValid = true;

            // Validate Gross Sales (Must be number >= 0 and reasonable max limit)
            const grossVal = parseFloat(document.getElementById("app-gross").value);
            if (isNaN(grossVal) || grossVal < 0 || grossVal > 1000000000) {
                toggleError("app-gross", "err-app-gross", true, "Must be a positive value below 1 Billion.");
                isValid = false;
            } else {
                toggleError("app-gross", "err-app-gross", false);
            }

            // Validate Exempt Revenue (Must be >= 0 and <= Gross Sales)
            const exemptVal = parseFloat(document.getElementById("app-exempt").value);
            if (isNaN(exemptVal) || exemptVal < 0 || exemptVal > grossVal) {
                toggleError("app-exempt", "err-app-exempt", true, "Exempt revenue cannot exceed gross sales.");
                isValid = false;
            } else {
                toggleError("app-exempt", "err-app-exempt", false);
            }

            // Validate Description (10 to 500 chars)
            const descVal = document.getElementById("app-desc").value.trim();
            if (descVal.length < 10 || descVal.length > 500) {
                toggleError("app-desc", "err-app-desc", true, "Description must be between 10 and 500 characters.");
                isValid = false;
            } else {
                toggleError("app-desc", "err-app-desc", false);
            }

            // Validate Uploads
            if (!fileUploaded) {
                dropzone.classList.add("input-error");
                const errDropzone = document.getElementById("err-app-dropzone");
                errDropzone.textContent = "Mandatory document missing.";
                errDropzone.classList.remove("hidden");
                isValid = false;
            }

            if (isValid) {
                alert("Application submitted successfully to the Assessor's pool!");
                setRoute(routes.find(r => r.btn === document.getElementById("nav-assessments")));
            }
        });
    }

    // Clear errors on input change for better UX
    document.querySelectorAll('.form-control').forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('input-error');
            const errorMsg = document.getElementById(`err-${this.id}`);
            if (errorMsg) errorMsg.classList.add('hidden');
        });
    });

    // =========================================================
    // PAYMENT HISTORY LOGIC (SEARCH, FILTER, CSV)
    // =========================================================
    const historySearchInput = document.getElementById("history-search-input");
    const historyFilterBiz = document.getElementById("history-filter-biz");
    const historyFilterType = document.getElementById("history-filter-type");
    const exportCsvBtn = document.getElementById("btn-export-csv");
    const historyTableBody = document.querySelector(".history-data-table tbody");

    function filterHistoryTable() {
        if (!historyTableBody) return;
        
        const searchVal = historySearchInput ? historySearchInput.value : "";
        // Stricter Regex: only alphanumeric, spaces, dashes, underscores
        const dangerousRegex = /[^a-zA-Z0-9\s\-_]/g; 
        
        if (dangerousRegex.test(searchVal)) {
            toggleError("history-search-input", "err-history-search", true, "Special characters (<, >, \", ') are not allowed.");
            return;
        } else {
            toggleError("history-search-input", "err-history-search", false);
        }

        const query = searchVal.trim().toLowerCase();
        const bizFilter = historyFilterBiz ? historyFilterBiz.value : "all";
        const typeFilter = historyFilterType ? historyFilterType.value : "all";

        const rows = historyTableBody.querySelectorAll("tr");

        rows.forEach(row => {
            const cells = row.querySelectorAll("td");
            if (cells.length < 6) return;

            const bizName = cells[1].textContent.trim();
            const type = cells[2].textContent.trim();
            const receipt = cells[5].textContent.trim(); 

            const matchesSearch = query === "" || 
                                  bizName.toLowerCase().includes(query) || 
                                  type.toLowerCase().includes(query) || 
                                  receipt.toLowerCase().includes(query);

            const matchesBiz = bizFilter === "all" || bizName === bizFilter;
            const matchesType = typeFilter === "all" || type === typeFilter;

            if (matchesSearch && matchesBiz && matchesType) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }

    if (historySearchInput) historySearchInput.addEventListener("input", filterHistoryTable);
    if (historyFilterBiz) historyFilterBiz.addEventListener("change", filterHistoryTable);
    if (historyFilterType) historyFilterType.addEventListener("change", filterHistoryTable);

    if (exportCsvBtn) {
        exportCsvBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (!historyTableBody) return;

            let csvContent = "Date,Business Name,Assessment Type,Amount,Status,Receipt\n";
            const rows = historyTableBody.querySelectorAll("tr");
            let hasData = false;

            rows.forEach(row => {
                if (row.style.display !== "none") {
                    hasData = true;
                    const cells = row.querySelectorAll("td");
                    const rowData = Array.from(cells).map(cell => {
                        let text = cell.textContent.trim().replace(/"/g, '""'); 
                        if (text.search(/("|,|\n)/g) >= 0) {
                            text = `"${text}"`;
                        }
                        return text;
                    });
                    csvContent += rowData.join(",") + "\n";
                }
            });

            if (!hasData) {
                alert("No data available to export based on current filters.");
                return;
            }

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "pasaybiz_payment_history.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }

    // =========================================================
    // HISTORY LOGS LOGIC (LIVE SEARCH & FILTER VALIDATIONS)
    // =========================================================
    const logsSearchInput = document.getElementById("logs-search-input");
    const logsFilterBiz = document.getElementById("logs-filter-biz");
    const logsFilterAction = document.getElementById("logs-filter-action");
    const logsTableBody = document.querySelector("#logs-data-table tbody");

    function filterLogsTable() {
        if (!logsTableBody) return;

        const searchVal = logsSearchInput ? logsSearchInput.value : "";
        const dangerousRegex = /[^a-zA-Z0-9\s\-_]/g;

        if (dangerousRegex.test(searchVal)) {
            toggleError("logs-search-input", "err-logs-search", true, "Special characters (<, >, \", ') are not allowed.");
            return;
        } else {
            toggleError("logs-search-input", "err-logs-search", false);
        }

        const query = searchVal.trim().toLowerCase();
        const bizFilter = logsFilterBiz ? logsFilterBiz.value : "all";
        const actionFilter = logsFilterAction ? logsFilterAction.value : "all";

        const rows = logsTableBody.querySelectorAll("tr");

        rows.forEach(row => {
            const cells = row.querySelectorAll("td");
            if (cells.length < 7) return;

            const txnRef = cells[1].textContent.trim();
            const bizName = cells[2].textContent.trim();
            const actionType = cells[3].textContent.trim();

            const matchesSearch = query === "" || 
                                  txnRef.toLowerCase().includes(query) || 
                                  bizName.toLowerCase().includes(query) || 
                                  actionType.toLowerCase().includes(query);

            const matchesBiz = bizFilter === "all" || bizName === bizFilter;
            const matchesAction = actionFilter === "all" || actionType === actionFilter;

            if (matchesSearch && matchesBiz && matchesAction) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }

    if (logsSearchInput) logsSearchInput.addEventListener("input", filterLogsTable);
    if (logsFilterBiz) logsFilterBiz.addEventListener("change", filterLogsTable);
    if (logsFilterAction) logsFilterAction.addEventListener("change", filterLogsTable);
});