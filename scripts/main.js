// Mobile Navigation Toggle
const menuBtn = document.querySelector('.menu-btn');
const mobileNav = document.querySelector('.mobile-nav');
if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        if (mobileNav.classList.contains('active')) {
            menuBtn.textContent = 'CLOSE';
        } else {
            menuBtn.textContent = 'MENU';
        }
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.remove('active');
            menuBtn.textContent = 'MENU';
        });
    });
}

// Intersection Observer for fade-up animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

function observeExistingFadeUps() {
    document.querySelectorAll('.fade-up:not(.observed)').forEach(el => {
        observer.observe(el);
        el.classList.add('observed'); // Mark as observed
    });
}

// Initial observer call
observeExistingFadeUps();

// Nav link active observer
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

if (sections.length > 0 && navLinks.length > 0) {
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href');
                    if (href === `#${id}` || href === `index.html#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.2, rootMargin: "-10% 0px -80% 0px" });

    sections.forEach(section => navObserver.observe(section));
}

// --- THREE.JS HERO BACKGROUND ---
const canvas = document.getElementById('hero-canvas');
if (canvas && typeof THREE !== 'undefined') {
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

    let camera;
    function resizeCanvas() {
        const heroSection = document.getElementById('hero');
        if (!heroSection) return;

        const width = heroSection.clientWidth;
        const height = heroSection.clientHeight;

        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        if (camera) {
            camera.aspect = width / height;
            camera.position.z = width < 768 ? 16 : 10;
            camera.updateProjectionMatrix();
        }
    }

    const scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 10;

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const geometry = new THREE.TorusKnotGeometry(3, 0.8, 100, 16);
    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - window.innerWidth / 2);
        mouseY = (event.clientY - window.innerHeight / 2);
    });

    document.addEventListener('touchstart', (event) => {
        if (event.touches.length > 0) {
            mouseX = (event.touches[0].clientX - window.innerWidth / 2);
            mouseY = (event.touches[0].clientY - window.innerHeight / 2);
        }
    }, { passive: true });

    document.addEventListener('touchmove', (event) => {
        if (event.touches.length > 0) {
            mouseX = (event.touches[0].clientX - window.innerWidth / 2);
            mouseY = (event.touches[0].clientY - window.innerHeight / 2);
        }
    }, { passive: true });

    const clock = new THREE.Clock();

    let isHeroVisible = true;
    const heroObserver = new IntersectionObserver((entries) => {
        isHeroVisible = entries[0].isIntersecting;
    }, { threshold: 0 });
    const heroSection = document.getElementById('hero');
    if (heroSection) heroObserver.observe(heroSection);

    function animate() {
        requestAnimationFrame(animate);
        if (!isHeroVisible) return; // Pause rendering loop to save CPU/Battery

        const elapsedTime = clock.getElapsedTime();

        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;

        mesh.rotation.y += 0.05 * (targetX - mesh.rotation.y);
        mesh.rotation.x += 0.05 * (targetY - mesh.rotation.x);
        mesh.rotation.z += 0.002;
        mesh.position.y = Math.sin(elapsedTime * 0.5) * 0.2;

        renderer.render(scene, camera);
    }

    window.addEventListener('load', () => {
        animate();
    });
}

// Generate Featured Projects (index.html)
const featuredGrid = document.querySelector('.project-grid.featured');
if (featuredGrid && typeof MOCK_PROJECTS !== 'undefined') {
    const shuffled = [...MOCK_PROJECTS].sort(() => 0.5 - Math.random());
    const featured = shuffled.slice(0, 6);

    featuredGrid.innerHTML = featured.map((p, i) => {
        let delayClass = `delay-${(i % 3) + 1}`; // Staggering effect
        return `
        <div class="project-wrap fade-up ${delayClass}">
            <a href="${p.link}" target="_blank" style="text-decoration: none; color: inherit; display: block; position: relative;">
                <div class="project-base">
                    <div class="project-thumbnail">
                        <img src="${p.realImage}" alt="${p.title}">
                    </div>
                    <div class="project-meta-bottom">
                        <div class="meta-header">
                            <span class="p-domain">${p.domain}</span>
                            <h4>${p.title}</h4>
                        </div>
                        <p class="pitch-desc">${p.shortDescription}</p>
                        <div class="pitch-meta">
                            <span><strong>TECH:</strong> ${p.techStack.split(',')[0]}</span>
                            <span><strong>STATUS:</strong> Shipped</span>
                        </div>
                    </div>
                </div>
                
                <div class="project-expanded-overlay">
                    <div class="expanded-content">
                        <img src="${p.realImage}" alt="${p.title}" class="expanded-img">
                        <div class="expanded-details">
                            <span class="p-domain">${p.domain}</span>
                            <h3 class="p-title">${p.title}</h3>
                            <p class="p-desc">${p.shortDescription}</p>
                            <div class="tech-stack-wrap"><span>Stack:</span> ${p.techStack}</div>
                            <div class="view-btn">View Project<span>→</span></div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    `}).join('');

    // Call observer again to catch the newly injected nodes
    observeExistingFadeUps();
}

// Generate All Projects (projects.html layout)
const allProjectsGrid = document.getElementById('all-projects-grid');
if (allProjectsGrid && typeof MOCK_PROJECTS !== 'undefined') {
    allProjectsGrid.innerHTML = MOCK_PROJECTS.map((p, index) => `
        <div class="project-wrap fade-up delay-${(index % 3) + 1}">
            <a href="${p.link}" target="_blank" style="text-decoration: none; color: inherit; display: block; position: relative;">
                <div class="project-base">
                    <div class="project-thumbnail">
                        <img src="${p.realImage}" alt="${p.title}" loading="lazy">
                    </div>
                    <div class="project-meta-bottom">
                        <div class="meta-header">
                            <span class="p-domain">${p.domain}</span>
                            <h4>${p.title}</h4>
                        </div>
                        <p class="pitch-desc">${p.shortDescription}</p>
                        <div class="pitch-meta">
                            <span><strong>TECH:</strong> ${p.techStack.split(',')[0]}</span>
                            <span><strong>STATUS:</strong> Shipped</span>
                        </div>
                    </div>
                </div>
                
                <div class="project-expanded-overlay">
                    <div class="expanded-content">
                        <img src="${p.realImage}" alt="${p.title}" loading="lazy" class="expanded-img">
                        <div class="expanded-details">
                            <span class="p-domain">${p.domain}</span>
                            <h3 class="p-title">${p.title}</h3>
                            <p class="p-desc">${p.shortDescription}</p>
                            <div class="tech-stack-wrap"><span>Stack:</span> ${p.techStack}</div>
                            <div class="view-btn">View Project<span>→</span></div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    `).join('');

    // Call observer again to catch the newly injected nodes
    observeExistingFadeUps();
}

// Mobile touch active state fallback for projects
// Prevents sticky "hover" on touch devices and ensures tapping outside closes them
document.addEventListener('touchstart', (e) => {
    // Check if we are touching a project wrap
    const clickedWrap = e.target.closest('.project-wrap');

    if (!clickedWrap) {
        // Touched outside, clear all
        document.querySelectorAll('.project-wrap').forEach(w => w.classList.remove('touch-active'));
        return;
    }

    // Clear others
    document.querySelectorAll('.project-wrap').forEach(w => {
        if (w !== clickedWrap) w.classList.remove('touch-active');
    });

    // Add to clicked
    clickedWrap.classList.add('touch-active');
}, { passive: true });

// --- MAGNETIC BUTTON LOGIC ---
const wrapper = document.getElementById('magnet-target');
const btn = document.getElementById('magnet-btn');

if (wrapper && btn) {
    // How strong the pull is (higher = pulls further away from center)
    const magneticStrength = 0.4; 

    wrapper.addEventListener('mousemove', (e) => {
        // Get dimensions and position of the invisible wrapper
        const rect = wrapper.getBoundingClientRect();
        
        // Calculate mouse position relative to the center of the wrapper
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        // Move the inner button towards the mouse
        btn.style.transform = `translate(${x * magneticStrength}px, ${y * magneticStrength}px)`;
    });

    wrapper.addEventListener('mouseleave', () => {
        // Snap back to dead center when the mouse leaves the area
        btn.style.transform = `translate(0px, 0px)`;
    });
}
