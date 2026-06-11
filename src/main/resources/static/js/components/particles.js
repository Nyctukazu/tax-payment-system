
export function initializeParticles() {
    const canvas = document.getElementById("particle-canvas");
    const canvas2 = document.getElementById("particle-canvas2");
    if (!canvas && !canvas2) return;

    const activeCanvas = canvas || canvas2;
    const isMobile = window.innerWidth < 768;

    const particleCount = isMobile ? 25 : 50;

    for (let i = 0; i < particleCount; i++) {
        const triangle = document.createElement("div");
        triangle.classList.add("triangle");

      
        const randomLeft = Math.random() * 100;

        const startTop = 105; 
        
        const randomScale = Math.random() * 2 + 0.4; 
        const randomOpacity = randomScale/4.8;
        const randomRotation = Math.random() * 360; 

        const randomDuration = Math.random() * 15 + 15; 
        const randomDelay = Math.random() * -20; 

        const color = canvas ? '20px solid #580B74' : '20px solid #F98513';

        triangle.style.left = `${randomLeft}%`;
        triangle.style.top = `${startTop}vh`;
        triangle.style.transform = `rotate(${randomRotation}deg)`;
        triangle.style.scale = randomScale;
        triangle.style.animationDuration = `${randomDuration}s`;
        triangle.style.animationDelay = `${randomDelay}s`;
        triangle.style.opacity = randomOpacity;
        triangle.style.borderBottom = color;

        activeCanvas.appendChild(triangle);
    }
}
