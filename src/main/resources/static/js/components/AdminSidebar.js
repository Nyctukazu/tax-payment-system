
class AdminSidebar extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="sidebar-container">
                <a href="/index.html" class="sidebar-item">Homepage</a>
                <a href="/analytics.html" class="sidebar-item">Analytics</a>
                <a href="/users.html" class="sidebar-item active">Management</a>
                <a href="/settings.html" class="sidebar-item">Settings</a>
            </div>

        `;
    }
}

export function initAdminSidebar() {
    if (!customElements.get('admin-sidebar')) {
        customElements.define('admin-sidebar', AdminSidebar);
    }
}

