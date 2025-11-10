// Main.js - Legacy support and utility functions
// The Bustling World system is loaded separately via bustling-world.js

document.addEventListener('DOMContentLoaded', () => {
    // Keep existing Router functionality for compatibility
    if (typeof Router !== 'undefined') {
        window.Router = Router;
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

// Add smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Performance optimization: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}