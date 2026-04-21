// Mobile Navigation Toggle
const menuBtn = document.querySelector('.menu-btn');
const mobileNav = document.querySelector('.mobile-nav');
if(menuBtn && mobileNav) {
    menuBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('active');
        if(mobileNav.classList.contains('active')) {
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
        
        if(camera) {
            camera.aspect = width / height;
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
    
    const clock = new THREE.Clock();
    
    function animate() {
        requestAnimationFrame(animate);
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
            <a href="projects.html" style="text-decoration: none; color: inherit; display: block; position: relative;">
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
                            <div class="view-btn">Review Case Study <span>→</span></div>
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
            <a href="projects.html" style="text-decoration: none; color: inherit; display: block; position: relative;">
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
                            <div class="view-btn">Review Case Study <span>→</span></div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    `).join('');
    
    // Call observer again to catch the newly injected nodes
    observeExistingFadeUps();
}
