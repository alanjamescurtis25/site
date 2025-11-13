/**
 * Content Configuration System
 * Manages persona-specific content and data
 *
 * @author Alan James Curtis
 * @version 1.0.0
 */

class ContentConfig {
    constructor() {
        this.personas = ['founder', 'operator', 'investor', 'dad'];
        this.currentPersona = null;
        this.contentCache = new Map();
        this.init();
    }

    /**
     * Initialize content configuration
     */
    init() {
        this.currentPersona = localStorage.getItem('selectedPersona') || 'founder';
        this.setupContentPaths();
    }

    /**
     * Setup content paths for each persona
     */
    setupContentPaths() {
        this.contentPaths = {
            founder: {
                bio: '/content/founder/data/bio.json',
                articles: '/content/founder/articles/',
                images: '/content/founder/images/',
                quotes: '/content/founder/data/quotes.json',
                investments: '/content/founder/data/investments.json'
            },
            operator: {
                bio: '/content/operator/data/bio.json',
                articles: '/content/operator/articles/',
                images: '/content/operator/images/',
                quotes: '/content/operator/data/quotes.json',
                projects: '/content/operator/data/projects.json'
            },
            investor: {
                bio: '/content/investor/data/bio.json',
                articles: '/content/investor/articles/',
                images: '/content/investor/images/',
                portfolio: '/content/investor/data/portfolio.json',
                insights: '/content/investor/data/insights.json'
            },
            dad: {
                bio: '/content/dad/data/bio.json',
                articles: '/content/dad/articles/',
                images: '/content/dad/images/',
                stories: '/content/dad/data/stories.json',
                wisdom: '/content/dad/data/wisdom.json'
            }
        };
    }

    /**
     * Get content path for current persona
     * @param {string} contentType - Type of content
     * @returns {string} Content path
     */
    getContentPath(contentType) {
        const persona = this.currentPersona;
        return this.contentPaths[persona]?.[contentType] || null;
    }

    /**
     * Load persona-specific content
     * @param {string} contentType - Type of content to load
     * @returns {Promise} Content data
     */
    async loadContent(contentType) {
        const cacheKey = `${this.currentPersona}-${contentType}`;

        // Check cache first
        if (this.contentCache.has(cacheKey)) {
            return this.contentCache.get(cacheKey);
        }

        const path = this.getContentPath(contentType);
        if (!path) {
            console.warn(`Content type ${contentType} not found for ${this.currentPersona}`);
            return null;
        }

        try {
            const response = await fetch(path);
            if (!response.ok) {
                // Fallback to default content
                return this.getDefaultContent(contentType);
            }

            const data = await response.json();
            this.contentCache.set(cacheKey, data);
            return data;
        } catch (error) {
            console.error(`Error loading content: ${error}`);
            return this.getDefaultContent(contentType);
        }
    }

    /**
     * Get default content as fallback
     * @param {string} contentType - Type of content
     * @returns {object} Default content
     */
    getDefaultContent(contentType) {
        const defaults = {
            bio: {
                title: 'About Me',
                content: 'Content coming soon...',
                image: '/assets/default.jpg'
            },
            articles: [],
            quotes: [],
            investments: [],
            portfolio: [],
            projects: []
        };

        return defaults[contentType] || null;
    }

    /**
     * Switch persona and reload content
     * @param {string} persona - New persona
     */
    async switchPersona(persona) {
        if (!this.personas.includes(persona)) {
            console.error(`Invalid persona: ${persona}`);
            return;
        }

        this.currentPersona = persona;
        localStorage.setItem('selectedPersona', persona);

        // Clear cache for fresh content
        this.contentCache.clear();

        // Trigger content reload event
        window.dispatchEvent(new CustomEvent('personaChanged', {
            detail: { persona }
        }));
    }

    /**
     * Preload content for better performance
     * @param {array} contentTypes - Content types to preload
     */
    async preloadContent(contentTypes = []) {
        const promises = contentTypes.map(type => this.loadContent(type));
        await Promise.all(promises);
    }

    /**
     * Clear content cache
     */
    clearCache() {
        this.contentCache.clear();
    }
}

// Export for global use
window.ContentConfig = ContentConfig;

// Initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.contentConfig = new ContentConfig();
    });
} else {
    window.contentConfig = new ContentConfig();
}