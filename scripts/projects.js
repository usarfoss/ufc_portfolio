// ============================================
// PROJECT ARCHIVE — Uniform Card Grid
// ============================================

(function () {
    if (typeof MOCK_PROJECTS === 'undefined') return;

    const projects = [...MOCK_PROJECTS];

    // Entry count
    const entryCount = document.getElementById('entry-count');
    if (entryCount) {
        entryCount.textContent = String(projects.length).padStart(3, '0');
    }

    // ---- RENDER ALL PROJECTS AS IDENTICAL CARDS ----
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    function renderCards(list) {
        grid.innerHTML = list.map((p, i) => `
            <a href="${p.link}" target="_blank" style="text-decoration: none; color: inherit; display: block;" class="project-card fade-up" data-domain="${p.domain}" data-title="${p.title.toLowerCase()}" data-desc="${p.shortDescription.toLowerCase()}">
                <div class="card-media">
                    <img src="${p.realImage}" alt="${p.title}" loading="lazy">
                    <div class="card-media-overlay"></div>
                    <span class="card-number">${String(i + 1).padStart(2, '0')}</span>
                    <span class="card-domain-tag">${p.domain}</span>
                </div>
                <div class="card-body">
                    <h3 class="card-title">${p.title}</h3>
                    <p class="card-desc">${p.shortDescription}</p>
                </div>
                <div class="card-footer">
                    <span class="card-tech">${p.techStack}</span>
                    <span class="material-symbols-outlined card-arrow">arrow_outward</span>
                </div>
            </a>
        `).join('');

        // Re-observe fade-ups
        if (typeof observeExistingFadeUps === 'function') {
            observeExistingFadeUps();
        }
    }

    renderCards(projects);

    // ---- FILTER + SEARCH ----
    const filterTags = document.querySelectorAll('.filter-tag');
    const searchInput = document.getElementById('project-search');

    function applyFilters() {
        const activeTag = document.querySelector('.filter-tag.active');
        const domain = activeTag ? activeTag.dataset.filter : 'all';
        const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

        document.querySelectorAll('.project-card').forEach(card => {
            const d = card.dataset.domain;
            const t = card.dataset.title || '';
            const desc = card.dataset.desc || '';

            const domainMatch = domain === 'all' || d === domain;
            const searchMatch = !query || t.includes(query) || desc.includes(query) || d.toLowerCase().includes(query);

            card.classList.toggle('hidden', !(domainMatch && searchMatch));
        });
    }

    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            applyFilters();
        });
    });

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

})();
