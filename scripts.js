
// Cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
});

function animRing() {
    rx += (mx - rx) * .12; ry += (my - ry) * .12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
} animRing();

document.querySelectorAll('a,.btn,.proj,.tech,.stat,.contact-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
        cursor.style.background = 'rgba(27,228,200,0.4)';
        ring.style.width = '48px'; ring.style.height = '48px';
    });
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%,-50%) scale(1)';
        cursor.style.background = 'var(--teal)';
        ring.style.width = '32px'; ring.style.height = '32px';
    });
});

// Background canvas
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
function resize() { canvas.width = innerWidth; canvas.height = innerHeight; }
resize(); window.addEventListener('resize', resize);

const pts = Array.from({ length: 55 }, () => ({
    x: Math.random() * innerWidth,
    y: Math.random() * innerHeight,
    vx: (Math.random() - .5) * .22,
    vy: (Math.random() - .5) * .22,
}));

let t = 0;
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    t += .003;

    // waves
    for (let w = 0; w < 4; w++) {
        ctx.beginPath();
        const yb = (canvas.height / 5) * (w + 1);
        ctx.moveTo(0, yb);
        for (let x = 0; x <= canvas.width; x += 3) {
            const y = yb + Math.sin(x * .007 + t + w) * 16 + Math.sin(x * .014 + t * 1.2 + w * 2) * 7;
            ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(27,228,200,${.015 + w * .007})`;
        ctx.lineWidth = 1; ctx.stroke();
    }

    // nodes
    pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
    for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 90) {
                ctx.beginPath();
                ctx.moveTo(pts[i].x, pts[i].y);
                ctx.lineTo(pts[j].x, pts[j].y);
                ctx.strokeStyle = `rgba(168,216,234,${.03 * (1 - d / 90)})`;
                ctx.lineWidth = .5; ctx.stroke();
            }
        }
        ctx.beginPath();
        ctx.arc(pts[i].x, pts[i].y, 1, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(27,228,200,0.12)'; ctx.fill();
    }
    requestAnimationFrame(draw);
} draw();

// Scroll reveal
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
    });
}, { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));