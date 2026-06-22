import { initAdminHeader } from "./components/AdminHeader.js";
import { initAdminSidebar } from "./components/AdminSidebar.js";
import { initializeParticles } from "./components/particles.js";
import { initDashboard } from "./page/dashboard-page.js";
import { initEvaluationInbox } from "./page/evaluation-inbox-page.js";
import { initEvaluationReview } from "./page/evaluation-review-page.js";
import { initUserControl } from "./page/user-access-page.js";


document.addEventListener("DOMContentLoaded", () => {
    initAdminHeader();
    initAdminSidebar();
    initializeParticles();
    init();
});

async function init() {
    const pageId = document.body.id;
    console.log("Current pageId detected:", pageId);

    switch (pageId) {
        case 'pageDashboard':
            await initDashboard();
            break;
        case 'pageEvaluationInbox':
            await initEvaluationInbox();
            break;
        case 'pageEvaluationReview':
            await initEvaluationReview();
            break;
        case 'pageUserControl':
            await initUserControl();
            break;
        default:
            console.warn('Unknown page layout', pageId);
    }
}
