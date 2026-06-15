import { getDashboardData } from "../services/dashboard-service.js";

initDashboard();

export async function initDashboard() {
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

function renderTrendChart(trendItems) {
    const svg = document.getElementById("lineChart");
    if (!svg || !trendItems || trendItems.length < 2) return;

    const w = 320;
    const h = 180;

    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

    const values = trendItems.map(item => item.value);
    const max = Math.max(...values);
    const min = Math.min(...values);

    const range = max - min || 1;

    const paddingLeft = 45;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 40;

    const normalizeY = v => h - paddingBottom - ((v - min) / range) * (h - paddingTop - paddingBottom);
    const normalizeX = (idx, total) => paddingLeft + (idx * (w - paddingLeft - paddingRight)) / (total - 1);

    const yTicks = [min, min + range / 2, max];
    const gridElements = yTicks.map(tickVal => {
        const yPos = normalizeY(tickVal);
        return `
            <line x1="${paddingLeft}" y1="${yPos}" x2="${w - paddingRight}" y2="${yPos}" stroke="#e5e7eb" stroke-dasharray="4 4" stroke-width="1" />
            <text x="${paddingLeft - 8}" y="${yPos + 4}" text-anchor="end" fill="#9ca3af" font-size="10" font-family="sans-serif">
                ${Math.round(tickVal)}
            </text>
        `;
    }).join("");

    const path = trendItems.map((item, i) => 
        `${i === 0 ? "M" : "L"} ${normalizeX(i, trendItems.length)} ${normalizeY(item.value)}`).join(" ");

    const baselineY = h - paddingBottom;
    const area = `${path} L ${normalizeX(trendItems.length - 1, trendItems.length)} ${h - 10} L ${normalizeX(0, trendItems.length)} ${h - 10} Z`;

    const textLabels = trendItems.map((item, i) => `
        <text
        x="${normalizeX(i, trendItems.length)}"
        y="${h - 10}"
        text-anchor="middle"
        fill=#6b7280"
        font-size="8"
        font-family="sans-serif"
    >
        ${item.label}
    </text>
    `).join("");

    const pointsData = trendItems.map((item, i) => ({
        x: normalizeX(i, trendItems.length),
        y: normalizeY(item.value),
        label: item.label,
        value: item.value
    }));
    
    svg.innerHTML = `
        <defs>
            <linearGradient id="g" x1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#F98513" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="#F98513" stop-opacity="0.05"/>
            </linearGradient>
        </defs>
        ${gridElements}
        <path d="${area}" fill="url(#g)"></path>
        <path d="${path}" fill="none" stroke="#F98513" stroke-width="3" stroke-linecap="round"></path>
        ${textLabels}
        
        <g id="hoverGroup" opacity="0" pointer-events="none">
            <line id="hoverLine" x1="0" y1="${paddingTop}" x2="0" y2="${baselineY}" stroke="#9ca3af" stroke-width="1" stroke-dasharray="2 2" />
            <circle id="hoverCircleOuter" r="8" fill="#580B74" opacity="0.3" />
            <circle id="hoverCircleInner" r="4" fill="#F98513" stroke="#ffffff" stroke-width="1.5" />
            
            <g id="tooltipBox">
                <rect id="tipRect" rx="4" fill="#222245" height="24" />
                <text id="tipText" fill="#ffffff" font-size="11" font-family="sans-serif" font-weight="bold" text-anchor="middle" y="15"></text>
            </g>
        </g>

        <rect id="hoverOverlay" x="${paddingLeft}" y="${paddingTop}" width="${w - paddingLeft - paddingRight}" height="${baselineY - paddingTop}" fill="transparent" pointer-events="all" style="cursor: crosshair;" />
        `;

        const overlay = svg.querySelector("#hoverOverlay");
        const hoverGroup = svg.querySelector("#hoverGroup");
        const hoverLine = svg.querySelector("#hoverLine");
        const circleOuter = svg.querySelector("#hoverCircleOuter");
        const circleInner = svg.querySelector("#hoverCircleInner");
        const tipRect = svg.querySelector("#tipRect");
        const tipText = svg.querySelector("#tipText");
        const tooltipBox = svg.querySelector("#tooltipBox");

        overlay.addEventListener("mousemove", (e) => {
            const rect = svg.getBoundingClientRect();
            const mouseX = ((e.clientX - rect.left) / rect.width) * w;

            let closestPoint = pointsData[0];
            let minDistance = Math.abs(mouseX - closestPoint.x);

            for (let i = 1; i < pointsData.length; i++) {
                const dist = Math.abs(mouseX - pointsData[i].x);
                if (dist < minDistance) {
                    minDistance = dist;
                    closestPoint = pointsData[i];
                }
            }

            hoverGroup.setAttribute("opacity", "1");
            
            hoverLine.setAttribute("x1", closestPoint.x);
            hoverLine.setAttribute("x2", closestPoint.x);

            circleOuter.setAttribute("cx", closestPoint.x);
            circleOuter.setAttribute("cy", closestPoint.y);
            circleInner.setAttribute("cx", closestPoint.x);
            circleInner.setAttribute("cy", closestPoint.y);

            tipText.textContent = `${closestPoint.label}: ${closestPoint.value}`;
            
            const textWidth = tipText.getComputedTextLength() + 16;
            tipRect.setAttribute("width", textWidth);
            tipRect.setAttribute("x", -textWidth / 2);

            let tipX = closestPoint.x;
            let tipY = closestPoint.y - 32;
            if (tipY < 5) tipY = closestPoint.y + 15; // Flip text flag beneath pointer down if reaching top bounds

            tooltipBox.setAttribute("transform", `translate(${tipX}, ${tipY})`);
        });

        overlay.addEventListener("mouseleave", () => {
            hoverGroup.setAttribute("opacity", "0");
        });
    }



function renderBarChart(items) {
    const host = document.getElementById("barChart");
    if (!host || !items || items.length === 0) return;

    const w = 320
    const h = 210

    const values = items.map(x => x.value);
    const max = Math.max(...values, 1); 
    const min = 0;

    const paddingLeft = 45;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 40;

    const chartHeight = h - paddingTop - paddingBottom;
    const chartWidth = w - paddingLeft - paddingRight;

    const yTicks = [0, max / 2, max];
    const gridElements = yTicks.map(tickVal => {
        const yPos = h - paddingBottom - (tickVal / max) * chartHeight;
        return `
            <line x1="${paddingLeft}" y1="${yPos}" x2="${w - paddingRight}" y2="${yPos}" stroke="#e5e7eb" stroke-dasharray="4 4" stroke-width="1" />
            <text x="${paddingLeft - 8}" y="${yPos + 4}" text-anchor="end" fill="#9ca3af" font-size="10" font-family="sans-serif">
                ${Math.round(tickVal)}
            </text>
        `;
    }).join("");

    const totalBars = items.length;
    const barGap = 12;
    const totalGapsSpace = barGap * (totalBars - 1);
    const barWidth = Math.max(5, (chartWidth - totalGapsSpace) / totalBars);

    const barAndLabelElements = items.map((item, i) => {
        const barHeight = Math.max(4, (item.value / max) * chartHeight);
        const xPos = paddingLeft + i * (barWidth + barGap);
        const yPos = h - paddingBottom - barHeight;

        return `
            <rect 
                class="chart-bar"
                data-index="${i}"
                x="${xPos}" 
                y="${yPos}" 
                width="${barWidth}" 
                height="${barHeight}" 
                fill="${item.color}" 
                rx="4" ry="4"
                style="transition: fill-opacity 0.2s ease, transform 0.2s ease; cursor: pointer;"
            />
            <text 
                x="${xPos + barWidth / 2}" 
                y="${h - 12}" 
                text-anchor="middle" 
                fill="#6b7280" 
                font-size="11" 
                font-family="sans-serif"
            >
                ${item.label}
            </text>
        `
    }).join("");

    host.innerHTML = `
        <svg id="barChartSvg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
            ${gridElements}
            ${barAndLabelElements}

            <g id="barTooltipGroup" opacity="0" pointer-events="none">
                <rect id="barTipRect" rx="4" fill="#1f2937" height="24" />
                <text id="barTipText" fill="#ffffff" font-size="11" font-family="sans-serif" font-weight="bold" text-anchor="middle" y="15"></text>
            </g>
        </svg>
    `;

    const svg = document.getElementById("barChartSvg");
    const tooltipGroup = svg.querySelector("#barTooltipGroup");
    const tipRect = svg.querySelector("#barTipRect");
    const tipText = svg.querySelector("#barTipText");
    const bars = svg.querySelectorAll(".chart-bar");

    bars.forEach(bar => {
        bar.addEventListener("mouseenter", (e) => {
            const index = parseInt(bar.getAttribute("data-index"));
            const item = items[index];

            bars.forEach(b => b.setAttribute("fill-opacity", "0.4"));
            bar.setAttribute("fill-opacity", "1");

            const barX = parseFloat(bar.getAttribute("x"));
            const barY = parseFloat(bar.getAttribute("y"));
            const width = parseFloat(bar.getAttribute("width"));

            tipText.textContent = `${item.label}: ${item.value}`;
            
            const textWidth = tipText.getComputedTextLength() + 16;
            tipRect.setAttribute("width", textWidth);
            tipRect.setAttribute("x", -textWidth / 2);

            const tipX = barX + width / 2;
            let tipY = barY - 28;
            if (tipY < 5) tipY = barY + 12;

            tooltipGroup.setAttribute("transform", `translate(${tipX}, ${tipY})`);
            tooltipGroup.setAttribute("opacity", "1");
        });

        bar.addEventListener("mouseleave", () => {
            // Restore default values when pointer navigates away
            bars.forEach(b => b.setAttribute("fill-opacity", "1"));
            tooltipGroup.setAttribute("opacity", "0");
        });
    });
}

function renderDonut(items) {
    const donut = document.getElementById("donutChart");
    const legendContainer = document.getElementById("donutLegend");
    if (!donut || !items || items.length === 0) return;

    const total = items.reduce((a, b) => a + b.value, 0) || 1;
    
    let currentDegree = 0;
    const slicesData = items.map(item => {
        const start = currentDegree;
        const sliceDegrees = (item.value / total) * 360;
        currentDegree += sliceDegrees;
        return {
            ...item,
            start: Math.round(start),
            end: Math.round(currentDegree)
        };
    });

    function generateGradientString(highlightedIndex = null) {
        const gradientSlices = slicesData.map((slice, i) => {
            let color = slice.color;
            if (highlightedIndex !== null && i !== highlightedIndex) {
                color = `color-mix(in srgb, ${slice.color} 45%, #1f2937)`; 
            }
            return `${color} ${slice.start}deg ${slice.end}deg`;
        });
        return `conic-gradient(${gradientSlices.join(", ")})`;
    }

    donut.style.background = generateGradientString();

    if (legendContainer) {
        legendContainer.innerHTML = items.map((item, i) => `
            <li class="legend-item" data-index="${i}" style="cursor: pointer; transition: opacity 0.2s ease;">
                <span style="color:${item.color}; font-weight:700; margin-right: 6px;">■</span> 
                ${item.label} (${Math.round((item.value / total) * 100)}%)
            </li>
        `).join("");
    }

    let tooltip = document.getElementById("donutTooltip");
    if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.id = "donutTooltip";
        tooltip.style.cssText = `
            position: fixed;
            background: #1f2937;
            color: #ffffff;
            padding: 6px 10px;
            border-radius: 4px;
            font-size: 11px;
            font-family: sans-serif;
            font-weight: bold;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.15s ease;
            white-space: nowrap;
            z-index: 9999; 
            transform: translate(-50%, -130%); 
        `;
        document.body.appendChild(tooltip);
    }

    const legendItems = legendContainer ? legendContainer.querySelectorAll(".legend-item") : [];

    function handleHighlight(index) {
        donut.style.background = generateGradientString(index);
        legendItems.forEach((item, i) => {
            item.style.opacity = i === index ? "1" : "0.3";
        });
    }

    function handleReset() {
        donut.style.background = generateGradientString();
        legendItems.forEach(item => item.style.opacity = "1");
        tooltip.style.opacity = "0";
    }

    donut.addEventListener("mousemove", (e) => {
        const rect = donut.getBoundingClientRect();
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        let angle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
        angle = (angle + 90 + 360) % 360;

        const hoveredIndex = slicesData.findIndex(slice => angle >= slice.start && angle < slice.end);

        if (hoveredIndex !== -1) {
            const activeItem = slicesData[hoveredIndex];
            const pct = Math.round((activeItem.value / total) * 100);

            handleHighlight(hoveredIndex);

            tooltip.textContent = `${activeItem.label}: ${activeItem.value} (${pct}%)`;
            tooltip.style.opacity = "1";
            
            tooltip.style.left = `${e.clientX}px`;
            tooltip.style.top = `${e.clientY}px`;
        } else {
            handleReset();
        }
    });

    donut.addEventListener("mouseleave", handleReset);

    legendItems.forEach(item => {
        item.addEventListener("mouseenter", () => {
            const index = parseInt(item.getAttribute("data-index"));
            handleHighlight(index);
        });
        item.addEventListener("mouseleave", handleReset);
    });
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
        </tr>
    `).join("");
}