
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
if (canvas) {
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
}

// Scroll reveal
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
    });
}, { threshold: .1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── GLOBE ──
const globeContainer = document.getElementById('globe-container');

if (globeContainer) {
    const roraimaCoords = { lat: 2.73, lng: -61.32 };

    const myGlobe = Globe()(globeContainer)
        .backgroundColor('rgba(0,0,0,0)')
        .showAtmosphere(true)
        .atmosphereColor('#1be4c8')
        .width(globeContainer.offsetWidth)
        .height(globeContainer.offsetHeight)
        .pointOfView({ ...roraimaCoords, altitude: 2 }, 0);

    // Interaction
    myGlobe.controls().autoRotate = true;
    myGlobe.controls().autoRotateSpeed = 0.2;
    myGlobe.controls().enableZoom = false; // Rigidly disable scroll zoom
    myGlobe.controls().enablePan = false;

    // Load Data
    const WORLD_URL = 'https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson';
    const BRAZIL_URL = 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson';

    Promise.all([
        fetch(WORLD_URL).then(res => res.json()),
        fetch(BRAZIL_URL).then(res => res.json())
    ]).then(([countries, states]) => {
        const worldFeatures = countries.features.filter(d => d.properties.ISO_A3 !== 'AQ' && d.properties.ISO_A3 !== 'BRA');
        const allPolygons = [...worldFeatures, ...states.features];

        myGlobe
            .polygonsData(allPolygons)
            .polygonCapColor(d => {
                const name = d.properties.name || '';
                const sigla = d.properties.sigla || '';
                if (name === 'Roraima' || sigla === 'RR') return '#1be4c8';
                return 'rgba(27, 228, 200, 0.2)';
            })
            .polygonStrokeColor(() => '#1be4c8')
            .polygonSideColor(() => 'rgba(27, 228, 200, 0.1)');

        // Arcs
        const destinations = [
            { lat: 40.71, lng: -74.00 }, { lat: 48.85, lng: 2.35 },
            { lat: -23.55, lng: -46.63 }, { lat: 35.67, lng: 139.65 },
            { lat: 51.50, lng: -0.12 }
        ];

        myGlobe.arcsData(destinations.map(d => ({
            startLat: roraimaCoords.lat, startLng: roraimaCoords.lng,
            endLat: d.lat, endLng: d.lng
        })))
            .arcColor(() => ['#1be4c8', '#a8d8ea'])
            .arcDashLength(0.4)
            .arcDashGap(2)
            .arcDashAnimateTime(2000)
            .arcStroke(0.4);

        // Label (shifted slightly south to avoid overlap with heart highlight)
        myGlobe.labelsData([{ lat: 0.5, lng: -61.32, text: 'Roraima' }])
            .labelColor(() => '#f0f4f8')
            .labelSize(2.5)
            .labelDotRadius(0.4) // Subtle dot
            .labelResolution(3);
    });

    // Lights and Material
    setTimeout(() => {
        const scene = myGlobe.scene();
        const globeMat = myGlobe.globeMaterial();

        if (globeMat) {
            // Set base globe color safely
            if (globeMat.color && globeMat.color.set) globeMat.color.set('#060e1c');
            if (globeMat.emissive && globeMat.emissive.set) {
                globeMat.emissive.set('#1be4c8');
                globeMat.emissiveIntensity = 0.05;
            }
        }

        if (typeof THREE !== 'undefined' && scene) {
            scene.add(new THREE.AmbientLight(0xffffff, 2.0));
            const sun = new THREE.DirectionalLight(0xffffff, 1.5);
            sun.position.set(1, 1, 1);
            scene.add(sun);
        }
    }, 800);

    // Precise Resize
    window.addEventListener('resize', () => {
        const w = globeContainer.offsetWidth;
        const h = globeContainer.offsetHeight;
        myGlobe.width(w).height(h);
    });
}
