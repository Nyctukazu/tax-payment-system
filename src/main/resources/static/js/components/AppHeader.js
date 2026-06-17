
class AppHeader extends HTMLElement {
    connectedCallback() {

        const currentPath = window.location.pathname;
        
        const isDashboard = currentPath === '/client-dashboard' ? 'active' : '';

        this.innerHTML = `
            <header class="navbar-wrapper">
                <div class="navbar-brand"><img class="logo-image" src="images/logo.jpg">PasayBiz</div>

                <nav class="navbar-links">
                    
                    <a href="/client-dashboard" class="nav-item ${isDashboard}">
                        <div class="icon-glow-ring"></div>
                        <div class="icon-circle">
                            <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                        </div>
                        <span class="nav-label">Dashboard</span>
                    </a>

                    <button type="button" id="sidebarToggleBtn" class="nav-item menu-toggle-btn">
                        <div class="icon-circle">
                            <svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
                        </div>
                    </button>

                </nav>
            </header>
        `;

        this.querySelector('#sidebarToggleBtn').addEventListener('click', () => {
            window.dispatchEvent(new CustomEvent('toggle-admin-sidebar'));
        });

    }
}

export function initClientHeader() {
    if (!customElements.get('app-header')) {
        customElements.define('app-header', AppHeader);
    }
}
