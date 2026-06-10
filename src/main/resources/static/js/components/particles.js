

export function initializeParticles() {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;

    const isMobile = window.innerWidth < 768;

    const particleCount = isMobile ? 25 : 50;

    for (let i = 0; i < particleCount; i++) {
        const triangle = document.createElement("div");
        triangle.classList.add("triangle");

      
        const randomLeft = Math.random() * 100;

        const startTop = 105; 
        
        const randomScale = Math.random() * 1.2 + 0.4; 
        const randomRotation = Math.random() * 360; 

        const randomDuration = Math.random() * 15 + 15; 
        const randomDelay = Math.random() * -20; 

        triangle.style.left = `${randomLeft}%`;
        triangle.style.top = `${startTop}vh`;
        triangle.style.transform = `rotate(${randomRotation}deg)`;
        triangle.style.scale = randomScale;
        triangle.style.animationDuration = `${randomDuration}s`;
        triangle.style.animationDelay = `${randomDelay}s`;

        canvas.appendChild(triangle);
    }
}
