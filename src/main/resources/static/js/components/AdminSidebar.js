class AdminSidebar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="sidebar-overlay" id="sidebarOverlay"></div>
            <aside class="sidebar-drawer" id="sidebarDrawer">
                <div class="sidebar-links-container">
                    <a href="/admin-dashboard" class="sidebar-item">
                        <span class="sidebar-text">Dashboard Overview</span>
                    </a>
                    <a href="/profile" class="sidebar-item">
                        <span class="sidebar-text">Admin Profile</span>
                    </a>
                    <a href="/settings" class="sidebar-item">
                        <span class="sidebar-text">System Settings</span>
                    </a>
                    <a onclick="window.location.replace('/portal')" class="sidebar-item logout-accent" onclick="goToExternal(event, this.href)">
                         <svg viewBox="0 0 24 24" class="sidebar-icon">
                            <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L13.17 11H3v2h10.17zM19 3H5c-1.1 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                        </svg>
                        <span class="sidebar-text">Log Out Session</span>
                    </a>
                </div>
            </aside>
        `;

        const drawer = this.querySelector('#sidebarDrawer');
        const overlay = this.querySelector('#sidebarOverlay');

        const toggleSidebar = () => {
            drawer.classList.toggle('open');
            overlay.classList.toggle('visible');
        };

        window.addEventListener('toggle-admin-sidebar', toggleSidebar);

        overlay.addEventListener('click', toggleSidebar);
    }
}

export function initAdminSidebar() {
    if (!customElements.get('admin-sidebar')) {
        customElements.define('admin-sidebar', AdminSidebar);
    }
}