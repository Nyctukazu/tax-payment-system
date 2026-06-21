class AIPanel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.messages = [
            { text: "Hello! I am your Llama 3.2 AI assistant. How can I help you today?", sender: 'ai' }
        ]; 
    }

    connectedCallback() {
        this.render();
        this.renderInitialMessages();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/css/components/AIStyles.css">
            
            <!-- Floating Action Button -->
            <button class="fab" id="fab" aria-label="Open AI Assistant">
                <img class="Llama" src="https://raw.githubusercontent.com/lobehub/lobe-icons/refs/heads/master/packages/static-png/dark/ollama.png" alt="Llama Logo">
            </button>

            <!-- Chat Pop-out Window -->
            <div class="chat-window" id="chatWindow">
                <div class="header">
                    <span>AI Assistant</span>
                    <button class="close-btn" id="closeBtn" aria-label="Close Chat">✕</button>
                </div>
                <div class="messages-container" id="msgContainer"></div>
                <div class="input-area">
                    <input type="text" id="chatInput" placeholder="Type a message..." autocomplete="off" maxlength="1000">
                    <button class="global-btn" id="sendBtn">Send</button>
                </div>
            </div>
        `;
    }

    renderInitialMessages() {
        const container = this.shadowRoot.getElementById('msgContainer');
        if (!container) return;
        
        this.messages.forEach(msg => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${msg.sender}`;
            msgDiv.textContent = msg.text;
            container.appendChild(msgDiv);
        });
        
        container.scrollTop = container.scrollHeight;
    }

        addMessage(text, sender) {
        const container = this.shadowRoot.getElementById('msgContainer');
        if (!container) return;
        
        this.messages.push({ text, sender });

        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;

        if (sender === 'ai') {
            const lines = text.split('\n');
            let isInsideList = false;
            let currentList = null;

            lines.forEach(line => {
                const trimmedLine = line.trim();
                if (!trimmedLine) return; 

                if (trimmedLine.startsWith('*') || trimmedLine.startsWith('-')) {
                    if (!isInsideList) {
                        isInsideList = true;
                        currentList = document.createElement('ul');
                        currentList.style.margin = '4px 0';
                        currentList.style.paddingLeft = '20px';
                        msgDiv.appendChild(currentList);
                    }
                    const li = document.createElement('li');
                    li.textContent = trimmedLine.substring(1).trim();
                    currentList.appendChild(li);
                } else {
                    isInsideList = false;
                    const p = document.createElement('p');
                    p.style.margin = '4px 0 8px 0';
                    p.textContent = trimmedLine;
                    msgDiv.appendChild(p);
                }
            });
        } else {
            msgDiv.textContent = text;
        }

        container.appendChild(msgDiv);
        container.scrollTop = container.scrollHeight;
    }


    addLoadingIndicator() {
        const container = this.shadowRoot.getElementById('msgContainer');
        if (!container) return null;

        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'message ai loading';
        loadingDiv.textContent = 'Thinking...';
        container.appendChild(loadingDiv);
        container.scrollTop = container.scrollHeight;
        return loadingDiv;
    }

    setupEventListeners() {
        const root = this.shadowRoot;
        const fab = root.getElementById('fab');
        const chatWindow = root.getElementById('chatWindow');
        const closeBtn = root.getElementById('closeBtn');
        const sendBtn = root.getElementById('sendBtn');
        const input = root.getElementById('chatInput');

        fab.addEventListener('click', () => {
            chatWindow.classList.toggle('open');
            if (chatWindow.classList.contains('open')) {
                input.focus();
            }
        });
        
        closeBtn.addEventListener('click', () => chatWindow.classList.remove('open'));


    const handleSend = async () => {
        const text = input.value.trim();
        if (!text) return;

        this.addMessage(text, 'user');
        input.value = '';

        const loadingDiv = this.addLoadingIndicator();

        try {
            const BACKEND_URL = '/api/ai/chat';
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: text }) // Matches ChatRequest(String message)
            });

            if (loadingDiv) loadingDiv.remove();

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            const aiReply = data.response || "No response text found.";
            this.addMessage(aiReply, 'ai');

        } catch (error) {
            if (loadingDiv) loadingDiv.remove();
            console.error("AI Assistant Error:", error);
            this.addMessage("Sorry, I'm having trouble connecting to the Pasay Tax System assistant right now. Please try again later.", 'ai');
        }
    };


        sendBtn.addEventListener('click', handleSend);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }
}

export function initAIPanel() {
    if (!customElements.get('ai-panel')) {
        customElements.define('ai-panel', AIPanel);
    }
}
