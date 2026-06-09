
class AppHeader extends HTMLElement {
    connectedCallback() {

        const currentPath = window.location.pathname;
        
        const isHome = currentPath === '/' || currentPath.endsWith('index.html') ? 'active' : '';
        const isAbout = currentPath.includes('about') ? 'active' : '';
        const isContact = currentPath.includes('contact') ? 'active' : '';
        const isMenu = currentPath.includes('menu') || currentPath.includes('settings') ? 'active' : '';

        this.innerHTML = `
            <header class="navbar-wrapper">
                <div class="navbar-brand">PasayBiz Portal</div>

                <nav class="navbar-links">
                    
                    <a href="/index.html" class="nav-item ${isHome}">
                        <div class="icon-glow-ring"></div>
                        <div class="icon-circle">
                            <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                        </div>
                        <span class="nav-label">Home</span>
                    </a>

                    <a href="/about.html" class="nav-item ${isAbout}">
                        <div class="icon-glow-ring"></div>
                        <div class="icon-circle">
                            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                        </div>
                        <span class="nav-label">About Us</span>
                    </a>

                    <a href="/contact.html" class="nav-item ${isContact}">
                        <div class="icon-glow-ring"></div>
                        <div class="icon-circle">
                            <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                        </div>
                        <span class="nav-label">Contact</span>
                    </a>

                    <a href="/settings.html" class="nav-item ${isMenu}">
                        <div class="icon-glow-ring"></div>
                        <div class="icon-circle">
                            <svg viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
                        </div>
                        <span class="nav-label">Menu</span>
                    </a>

                </nav>
            </header>
        `;

    }
}

export function initHeader() {
    if (!customElements.get('app-header')) {
        customElements.define('app-header', AppHeader);
    }
}
