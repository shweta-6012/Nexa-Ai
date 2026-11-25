const canvas = document.getElementById("aiParticles");
const ctx = canvas.getContext("2d");

let particles = [];
let mouse = {
    x: null,
    y: null,
    radius: 150
};

const PARTICLE_COUNT = 110;
const CONNECTION_DISTANCE = 130;

function resizeCanvas() {

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);


// Particle class

class Particle {

    constructor() {

        this.x = Math.random() * canvas.offsetWidth;
        this.y = Math.random() * canvas.offsetHeight;

        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;

        this.size = Math.random() * 1.5 + 1;

    }

    update() {

        this.x += this.vx;
        this.y += this.vy;

        // Bounce from boundaries

        if (this.x < 0 || this.x > canvas.offsetWidth) {
            this.vx *= -1;
        }

        if (this.y < 0 || this.y > canvas.offsetHeight) {
            this.vy *= -1;
        }

        // Gentle mouse interaction

        if (mouse.x !== null) {

            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius && distance > 0) {

                const force = (mouse.radius - distance) / mouse.radius;

                this.x += (dx / distance) * force * 0.5;
                this.y += (dy / distance) * force * 0.5;

            }

        }

    }

    draw() {

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#5ee7ff";

        ctx.shadowBlur = 12;
        ctx.shadowColor = "#00cfff";

        ctx.fill();

        ctx.shadowBlur = 0;

    }

}


// Create particles

function createParticles() {

    particles = [];

    for (let i = 0; i < PARTICLE_COUNT; i++) {

        particles.push(new Particle());

    }

}


// Connect nearby particles

function connectParticles() {

    for (let i = 0; i < particles.length; i++) {

        for (let j = i + 1; j < particles.length; j++) {

            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;

            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CONNECTION_DISTANCE) {

                const opacity = 1 - distance / CONNECTION_DISTANCE;

                ctx.beginPath();

                ctx.moveTo(particles[i].x, particles[i].y);

                ctx.lineTo(particles[j].x, particles[j].y);

                ctx.strokeStyle = `rgba(94, 231, 255, ${opacity * 0.22})`;

                ctx.lineWidth = 0.7;

                ctx.stroke();

            }

        }

    }

}


// Animation loop

function animate() {

    ctx.clearRect(
        0,
        0,
        canvas.offsetWidth,
        canvas.offsetHeight
    );

    particles.forEach(particle => {

        particle.update();

        particle.draw();

    });

    connectParticles();

    requestAnimationFrame(animate);

}


// Mouse movement

window.addEventListener("pointermove", (event) => {

    const rect = canvas.getBoundingClientRect();

    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;

});


// Reset mouse when leaving

window.addEventListener("pointerleave", () => {

    mouse.x = null;
    mouse.y = null;

});


// Start animation

createParticles();

animate();