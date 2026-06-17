
class AppSidebar extends HTMLElement {
    connectedCallback() {
       this.innerHTML = `
            <div class="sidebar-overlay" id="sidebarOverlay"></div>
            <aside class="sidebar-drawer" id="sidebarDrawer">
                <div class="sidebar-links-container">
                    <a href="/client-dashboard" class="sidebar-item">
                        <i class="fa-solid fa-chart-pie sidebar-icon"></i>
                        <span class="sidebar-text">Dashboard Overview</span>
                    </a>
                    <a href="/business-portfolio" class="sidebar-item">
                        <i class="fa-solid fa-briefcase sidebar-icon"></i>
                        <span class="sidebar-text">Business Portfolio</span>
                    </a>
                    <a href="/tax-assessments" class="sidebar-item">
                        <i class="fa-solid fa-file-invoice-dollar sidebar-icon"></i>
                        <span class="sidebar-text">Tax Assessments</span>
                    </a>
                    <a href="/payment-history" class="sidebar-item">
                        <i class="fa-solid fa-credit-card sidebar-icon"></i> 
                        <span class="sidebar-text">Payment History</span>
                    </a>
                    <a href="/file-assessment" class="sidebar-item">
                        <i class="fa-solid fa-clipboard-list sidebar-icon"></i>
                        <span class="sidebar-text">File Assessment</span>
                    </a>
                    <a href="/receipts" class="sidebar-item">
                        <i class="fa-solid fa-receipt sidebar-icon"></i>
                        <span class="sidebar-text">Receipts</span>
                    </a>
                    <a href="/history" class="sidebar-item">
                        <i class="fa-solid fa-clock-rotate-left sidebar-icon"></i>
                        <span class="sidebar-text">History</span>
                    </a>
                    <a href="/system-settings" class="sidebar-item">
                        <i class="fa-solid fa-gear sidebar-icon"></i>
                        <span class="sidebar-text">System Settings</span>
                    </a>
                    <a href="/portal" class="sidebar-item logout-accent">
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

export function initClientSidebar() {
    if (!customElements.get('app-sidebar')) {
        customElements.define('app-sidebar', AppSidebar);
    }
}

