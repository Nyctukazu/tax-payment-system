
class AppSidebar extends HTMLElement {
    connectedCallback() {
       this.innerHTML = `
            <div class="sidebar-overlay" id="sidebarOverlay"></div>
            <aside class="sidebar-drawer" id="sidebarDrawer">
                <div class="sidebar-links-container" id="sidebarNav">
                    <button data-view="dashboard" class="sidebar-item">
                        <i class="fa-solid fa-chart-pie sidebar-icon"></i>
                        <span class="sidebar-text">Dashboard Overview</span>
                    </button>
                    <button data-view="portfolio" class="sidebar-item">
                        <i class="fa-solid fa-briefcase sidebar-icon"></i>
                        <span class="sidebar-text">Business Portfolio</span>
                    </button>
                    <button data-view="assessments" class="sidebar-item">
                        <i class="fa-solid fa-file-invoice-dollar sidebar-icon"></i>
                        <span class="sidebar-text">Tax Assessments</span>
                    </button>
                    <button data-view="history" class="sidebar-item">
                        <i class="fa-solid fa-credit-card sidebar-icon"></i> 
                        <span class="sidebar-text">Payment History</span>
                    </button>
                    <button data-view="create-application" class="sidebar-item">
                        <i class="fa-solid fa-clipboard-list sidebar-icon"></i>
                        <span class="sidebar-text">File Assessment</span>
                    </button>
                    <button data-view="receipt" class="sidebar-item">
                        <i class="fa-solid fa-receipt sidebar-icon"></i>
                        <span class="sidebar-text">Receipts</span>
                    </button>
                    <button data-view="general-history" class="sidebar-item">
                        <i class="fa-solid fa-clock-rotate-left sidebar-icon"></i>
                        <span class="sidebar-text">History</span>
                    </button>
                    <button data-view="settings" class="sidebar-item">
                        <i class="fa-solid fa-gear sidebar-icon"></i>
                        <span class="sidebar-text">System Settings</span>
                    </button>
                    <!-- Keep your logout button as is -->
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

        this.querySelector('#sidebarNav')?.addEventListener('click', (e) => {
            // Find the closest sidebar-item button even if they click the icon inside it
            const button = e.target.closest('.sidebar-item');
            const view = button?.getAttribute('data-view');
            
            if (view) {
                e.preventDefault();
                showView(view); // Calls your global routing function
                
                // Optional: Close the sidebar mobile drawer after clicking a link
                if (drawer.classList.contains('open')) {
                    toggleSidebar();
                }
            }
        });
    }
}

export function initClientSidebar() {
    if (!customElements.get('app-sidebar')) {
        customElements.define('app-sidebar', AppSidebar);
    }
}

