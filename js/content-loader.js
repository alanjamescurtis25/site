/**
 * Content Loader Component
 * Dynamically loads and displays persona-specific content
 *
 * @author Alan James Curtis
 * @version 1.0.0
 */

class ContentLoader {
    constructor() {
        this.contentConfig = window.contentConfig || new ContentConfig();
        this.currentPersona = localStorage.getItem('selectedPersona') || 'founder';
        this.contentCache = new Map();
        this.init();
    }

    /**
     * Initialize content loader
     */
    init() {
        this.setupEventListeners();
        this.loadCurrentPageContent();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for persona changes
        window.addEventListener('personaChanged', (e) => {
            this.currentPersona = e.detail.persona;
            this.clearCache();
            this.loadCurrentPageContent();
        });

        // Listen for page navigation
        window.addEventListener('pageChanged', (e) => {
            this.loadCurrentPageContent();
        });
    }

    /**
     * Load content for current page
     */
    async loadCurrentPageContent() {
        const page = this.getCurrentPage();

        switch (page) {
            case 'bio':
                await this.loadBioContent();
                break;
            case 'writing':
                await this.loadArticles();
                break;
            case 'quotes':
                await this.loadQuotes();
                break;
            case 'questions':
                await this.loadQuestions();
                break;
            case 'investments':
                await this.loadInvestments();
                break;
            default:
                console.log('No specific content for page:', page);
        }
    }

    /**
     * Load bio content
     */
    async loadBioContent() {
        const container = document.getElementById('bio-content');
        if (!container) return;

        try {
            const bioData = await this.contentConfig.loadContent('bio');

            if (bioData) {
                container.innerHTML = this.renderBio(bioData);
                this.animateContent(container);
            }
        } catch (error) {
            console.error('Error loading bio:', error);
            container.innerHTML = this.renderError('Failed to load bio content');
        }
    }

    /**
     * Load articles
     */
    async loadArticles() {
        const container = document.getElementById('articles-list');
        if (!container) return;

        try {
            const articles = await this.contentConfig.loadContent('articles');

            if (articles && articles.length > 0) {
                container.innerHTML = this.renderArticles(articles);
                this.animateContent(container);
            } else {
                container.innerHTML = this.renderEmptyState('No articles available yet');
            }
        } catch (error) {
            console.error('Error loading articles:', error);
            container.innerHTML = this.renderError('Failed to load articles');
        }
    }

    /**
     * Load quotes
     */
    async loadQuotes() {
        const container = document.getElementById('quotes-content');
        if (!container) return;

        try {
            const quotes = await this.contentConfig.loadContent('quotes');

            if (quotes && quotes.length > 0) {
                container.innerHTML = this.renderQuotes(quotes);
                this.animateContent(container);
            } else {
                container.innerHTML = this.renderEmptyState('No quotes available yet');
            }
        } catch (error) {
            console.error('Error loading quotes:', error);
            container.innerHTML = this.renderError('Failed to load quotes');
        }
    }

    /**
     * Load questions based on persona
     */
    async loadQuestions() {
        const container = document.getElementById('questions-content');
        if (!container) return;

        // Questions are persona-specific
        const questionSets = {
            founder: {
                categories: [
                    {
                        title: 'Vision & Strategy',
                        questions: [
                            'What problem are you solving that nobody else can?',
                            'How will the world be different in 5 years because of your company?',
                            'What's your unfair advantage?'
                        ]
                    },
                    {
                        title: 'Team & Culture',
                        questions: [
                            'What type of culture are you building?',
                            'How do you attract A-players?',
                            'What's your hiring philosophy?'
                        ]
                    }
                ]
            },
            operator: {
                categories: [
                    {
                        title: 'Execution',
                        questions: [
                            'How do you measure operational efficiency?',
                            'What's your approach to scaling?',
                            'How do you maintain quality while growing?'
                        ]
                    },
                    {
                        title: 'Process',
                        questions: [
                            'What processes can be automated?',
                            'How do you identify bottlenecks?',
                            'What's your approach to continuous improvement?'
                        ]
                    }
                ]
            },
            investor: {
                categories: [
                    {
                        title: 'Due Diligence',
                        questions: [
                            'What's the total addressable market?',
                            'What are the unit economics?',
                            'How defensible is the business model?'
                        ]
                    },
                    {
                        title: 'Returns',
                        questions: [
                            'What's the path to 10x returns?',
                            'What are the key risk factors?',
                            'How does this fit in the portfolio?'
                        ]
                    }
                ]
            },
            dad: {
                categories: [
                    {
                        title: 'Balance',
                        questions: [
                            'How do you balance work and family?',
                            'What values are you teaching?',
                            'How do you stay present?'
                        ]
                    },
                    {
                        title: 'Legacy',
                        questions: [
                            'What legacy are you building?',
                            'What life lessons matter most?',
                            'How do you define success?'
                        ]
                    }
                ]
            }
        };

        const questions = questionSets[this.currentPersona];

        if (questions) {
            container.innerHTML = this.renderQuestions(questions);
            this.animateContent(container);
        }
    }

    /**
     * Load investments/portfolio
     */
    async loadInvestments() {
        const container = document.getElementById('investments-content');
        if (!container) return;

        const contentType = this.currentPersona === 'investor' ? 'portfolio' : 'investments';

        try {
            const data = await this.contentConfig.loadContent(contentType);

            if (data) {
                container.innerHTML = this.renderInvestments(data);
                this.animateContent(container);
            }
        } catch (error) {
            console.error('Error loading investments:', error);
            container.innerHTML = this.renderError('Failed to load investment data');
        }
    }

    /**
     * Render bio content
     */
    renderBio(data) {
        return `
            <div class="bio-container animated-content">
                <h2 class="bio-title">${data.title}</h2>
                <h3 class="bio-subtitle">${data.subtitle}</h3>
                <p class="bio-description">${data.description}</p>

                ${data.highlights ? `
                    <div class="bio-highlights">
                        ${data.highlights.map(h => `
                            <div class="highlight-item">
                                <div class="highlight-title">${h.title}</div>
                                <div class="highlight-value">${h.value}</div>
                                <div class="highlight-desc">${h.description}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                ${data.philosophy ? `
                    <blockquote class="bio-philosophy">
                        "${data.philosophy}"
                    </blockquote>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render articles
     */
    renderArticles(articles) {
        return `
            <div class="articles-container animated-content">
                ${articles.map(article => `
                    <article class="article-item">
                        <h3 class="article-title">
                            <a href="${article.url}">${article.title}</a>
                        </h3>
                        <div class="article-meta">
                            <span class="article-date">${article.date}</span>
                            <span class="article-category">${article.category}</span>
                        </div>
                        <p class="article-excerpt">${article.excerpt}</p>
                    </article>
                `).join('')}
            </div>
        `;
    }

    /**
     * Render quotes
     */
    renderQuotes(quotes) {
        return `
            <div class="quotes-container animated-content">
                ${quotes.map(quote => `
                    <blockquote class="quote-item">
                        <p class="quote-text">"${quote.text}"</p>
                        ${quote.author ? `
                            <cite class="quote-author">— ${quote.author}</cite>
                        ` : ''}
                    </blockquote>
                `).join('')}
            </div>
        `;
    }

    /**
     * Render questions
     */
    renderQuestions(data) {
        return `
            <div class="questions-container animated-content">
                ${data.categories.map(category => `
                    <div class="question-category">
                        <h3 class="category-title">${category.title}</h3>
                        <ul class="question-list">
                            ${category.questions.map(q => `
                                <li class="question-item">${q}</li>
                            `).join('')}
                        </ul>
                    </div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Render investments
     */
    renderInvestments(data) {
        if (Array.isArray(data)) {
            return `
                <div class="investments-grid animated-content">
                    ${data.map(inv => `
                        <div class="investment-card">
                            <h3 class="investment-name">${inv.company}</h3>
                            <div class="investment-details">
                                <span class="investment-stage">${inv.stage}</span>
                                <span class="investment-sector">${inv.sector}</span>
                            </div>
                            ${inv.return ? `
                                <div class="investment-return">Return: ${inv.return}</div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
        }

        return this.renderEmptyState('Investment data coming soon');
    }

    /**
     * Render empty state
     */
    renderEmptyState(message) {
        return `
            <div class="empty-state">
                <p>${message}</p>
            </div>
        `;
    }

    /**
     * Render error state
     */
    renderError(message) {
        return `
            <div class="error-state">
                <p class="error-message">${message}</p>
                <button onclick="window.contentLoader.retry()" class="retry-button">
                    Try Again
                </button>
            </div>
        `;
    }

    /**
     * Animate content on load
     */
    animateContent(container) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(20px)';

        requestAnimationFrame(() => {
            container.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        });
    }

    /**
     * Get current page
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop().replace('.html', '');
        return page || 'index';
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.contentCache.clear();
        if (this.contentConfig) {
            this.contentConfig.clearCache();
        }
    }

    /**
     * Retry loading content
     */
    retry() {
        this.clearCache();
        this.loadCurrentPageContent();
    }
}

// Initialize content loader
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.contentLoader = new ContentLoader();
    });
} else {
    window.contentLoader = new ContentLoader();
}

// Export for external use
window.ContentLoader = ContentLoader;