// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('active');
        });

        // Close menu when clicking nav links on mobile
        document.querySelectorAll('#nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
            });
        });
    }
});

// URL Routing - Hash-based navigation for split-view pages
const Router = {
    init(config) {
        this.config = config;
        this.loadFromHash();

        window.addEventListener('hashchange', () => this.loadFromHash());

        // Set up click handlers
        document.querySelectorAll(`[${config.attribute}]`).forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const key = e.target.dataset[config.datasetKey];
                window.location.hash = key;
            });
        });
    },

    loadFromHash() {
        const hash = window.location.hash.slice(1);

        if (hash && this.config.data[hash]) {
            this.renderContent(hash);
            this.updateActiveState(hash);
        } else if (this.config.defaultHash) {
            window.location.hash = this.config.defaultHash;
        }
    },

    renderContent(key) {
        const data = this.config.data[key];
        if (data && this.config.render) {
            const html = this.config.render(data);
            document.getElementById(this.config.contentId).innerHTML = html;
        }
    },

    updateActiveState(key) {
        document.querySelectorAll(`[${this.config.attribute}]`).forEach(l => {
            l.classList.remove('active');
        });
        const activeLink = document.querySelector(`[${this.config.attribute}="${key}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
};

// Utility function to show loading state
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<div class="loading-state"><div class="loading-spinner"></div><span>Loading...</span></div>';
    }
}

// Utility function to show error state
function showError(elementId, message = 'An error occurred') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<div class="error-state"><h3>Error</h3><p>${message}</p></div>`;
    }
}

// Utility function to show empty state
function showEmpty(elementId, message = 'No content available') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<p class="empty-state">${message}</p>`;
    }
}
