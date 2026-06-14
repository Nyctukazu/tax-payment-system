import { getDashboardData } from "./services/dashboard-service.js";
import { initAdminHeader } from "./components/AdminHeader.js";

document.addEventListener("DOMContentLoaded", () => {
    initAdminHeader();
});


init();

async function init() {
    const data = await getDashboardData();
    renderHeader(data.user);
    renderNotifications(data.notifications);
    renderKpis(data.kpis);
    renderTrendChart(data.charts.trend);
    renderBarChart(data.charts.velocity);
    renderDonut(data.charts.sectors);
    renderBulletin(data.bulletin);
    renderAudit(data.auditTrail);
}

function renderHeader(user) {
    document.getElementById("welcomeTitle").textContent = `Welcome back, ${user.displayName}!`;
    document.getElementById("welcomeSubtitle").textContent = `Here is your system summary for ${user.dateLabel}.`;
    document.getElementById("userChip").textContent = user.displayName; 
}

function renderNotifications(items) {
    const host = document.getElementById("notificationList");
    host.innerHTML = items.map(n => `
        <article class="notice">
            <h4>${n.title}</h4>
            <p>${n.message}</p>
            <p>${n.time}</p>
        </article>
    `).join("");
}

function renderKpis(kpis) {
    const host = document.getElementById("kpiGrid");
    host.innerHTML = kpis.map(k => `
        <article class="kpi-card">
            <h4>${k.label}</h4>
            <p>${k.value}</p>
            <span class="delta">${k.delta}</span>
        </article>
    `).join("");
}

function renderTrendChart(points) {
    const svg = document.getElementById("lineChart");
    const w = 320;
    const h = 180;
    const max = Math.max(...points);
    const min = Math.min(...points);
    const normalizeY = v => h - ((v - min) / (max - min || 1)) * 140 - 20;
    const normalizeX = (idx, total) => 20 + (idx * (w - 40)) / (total - 1)

    const path = points.map((v, i) => `${i === 0 ? "M" : "L"} ${normalizeX(i, points.length)} ${normalizeY(v)}`).join(" ");
    const area = `${path} L ${normalizeX(points.length - 1, points.length)} ${h - 10} L ${normalizeX(0, points.length)} ${h - 10} Z`;
    
    svg.innerHTML = `
        <defs>
            <linearGradient id="g" x1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#22c55e" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="#22c55e" stop-opacity="0.05"/>
            <linearGradient>
        </defs>
        <path d="${area}" fill="url(#g)"></path>
        <path d="${path}" fill="none" stroke="#22c55e" stroke-width="3" stroke-linecap="round"></path>
    `;
}

function renderBarChart(items) {
    const host = document.getElementById("barChart");
    const max = Math.max(...items.map(x => x.value), 1); 
    host.innerHTML = items.map(items => {
        const height = Math.max(10, Math.round((items.value / max) * 170));
        return `<div class="bar" style="height:${height}px;background:${items.color}">
            <span>${items.label}</span>
        </div>`;
    }).join("");
}

function renderDonut(items) {
    const total = items.reduce((a, b) => a + b.value, 0);
    let current = 0;
    const slices = items.map(item => {
        const start = Math.round((current / total) * 360);
        current += item.value;
        const end = Math.round((current/total) * 360);
        return `${item.color} ${start}deg ${end}deg`;
    });
    
    const donut = document.getElementById("donutChart");
    donut.style.background = `conic-gradient(${slices.join(", ")})`;

    const legend = document.getElementById("donutLegend");
    legend.innerHTML = items.map(item =>
        `<li><span style="color:${item.color};font-weight:700">■</span> ${item.label} (${item.value}%)</li>`
    ).join("");
}

function renderBulletin(rows) {
    const tbody = document.querySelector("#bulletinTable tbody");
    tbody.innerHTML = rows.map(r => `
        <tr>
            <td><span class="tag">${r.level}</span></td>
            <td>${r.message}</td>
            <td>${r.time}</td>
        </tr>
    `).join("");
}

function renderAudit(rows) {
    const tbody = document.querySelector("#auditTable tbody");
    tbody.innerHTML = rows.map(r => `
        <tr>
            <td>${r.time}</td>
            <td>${r.action}</td>
            <td>${r.actor}</td>
        </td>
    `).join("");
}