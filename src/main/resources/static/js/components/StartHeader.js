class StartHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <header class="navbar">
                <div class="logo"><img class="logo-image" src="images/logo.jpg">PasayBiz Portal</div>
                <a type="button" onclick="window.location.replace('/')" class="back-home">&larr; Back to Home</a>
            </header>

        `;
    }
}

export function initStartHeader() {
    if (!customElements.get('start-header')) {
        customElements.define('start-header', StartHeader);
    }
}
