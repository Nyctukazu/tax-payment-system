class AdminHeader extends HTMLElement {
    connectedCallback() {

        const currentPath = window.location.pathname;
        const userRole = (window.USER_ROLE || 'CLERK').toLowerCase();
        
        const isDashboard = currentPath === '/admin-dashboard' || currentPath.endsWith('index.html') ? 'active' : '';
        const isQueuePage = currentPath.includes('about') ? 'active' : '';
        const isEvaluatePage = currentPath.includes('evaluate') ? 'active' : '';
        const isUserControl = currentPath.includes('user-control') ? 'active' : ''; 

        this.innerHTML = `
            <header class="navbar-wrapper">
                <div class="navbar-brand"><img class="logo-image" src="images/logo.jpg">PasayBiz Admin</div>

                <nav class="navbar-links">
                    
                    <a href="/admin-dashboard" class="nav-item ${isDashboard}">
                        <div class="icon-glow-ring"></div>
                        <div class="icon-circle">
                            <svg viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
                        </div>
                        <span class="nav-label">Dashboard</span>
                    </a>

                    <a href="/queue" class="nav-item ${isQueuePage}">
                        <div class="icon-glow-ring"></div>
                        <div class="icon-circle">
                           <svg viewBox="0 0 24 24">                 
                                <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" opacity="0.6"/>
                                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                            </svg>
                        </div>
                        <span class="nav-label">Queue</span>
                    </a>

                    <a href="/evaluate-inbox" class="nav-item ${isEvaluatePage}">
                        <div class="icon-glow-ring"></div>
                        <div class="icon-circle">
                            <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2zm0-4H7V7h10v2zm0 8H7v-2h10v2z"/></svg>
                        </div>
                        <span class="nav-label">Evaluate</span>
                    </a>

                    ${userRole === 'SUPERADMIN' ? `
                    <a href="/user-control" class="nav-item ${isUserControl}">
                        <div class="icon-glow-ring"></div>
                        <div class="icon-circle">
                            <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                        </div>
                        <span class="nav-label">UserControl</span>
                    </a>
                    ` : ''}

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

export function initAdminHeader() {
    if (!customElements.get('admin-header')) {
        customElements.define('admin-header', AdminHeader);
    }
}
