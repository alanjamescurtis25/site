/**
 * Writing SPA Handler
 * Manages Single Page Application functionality for writing articles
 */

(function() {
    'use strict';

    /**
     * Initialize Writing SPA functionality
     */
    function initWritingSPA() {
        const writingContentDiv = document.getElementById('writing-content');
        const postLinks = document.querySelectorAll('.post-list a');

        if (!writingContentDiv || !window.writingContent) {
            console.warn('Writing SPA: Required elements not found');
            return;
        }

        /**
         * Load and display an article
         * @param {string} articleKey - The article identifier
         */
        function loadArticle(articleKey) {
            const article = window.writingContent[articleKey];

            if (!article) {
                writingContentDiv.innerHTML = '<p class="empty-state">Article not found</p>';
                return;
            }

            // Render article content
            writingContentDiv.innerHTML = `
                <div class="article-header">
                    <h2 class="article-title">${article.title}</h2>
                </div>
                <div class="article-content">
                    ${article.content}
                </div>
            `;

            // Update active state
            postLinks.forEach(link => {
                link.classList.toggle('active', link.dataset.article === articleKey);
            });

            // Scroll to top of reading pane
            writingContentDiv.scrollTop = 0;
        }

        /**
         * Handle article link clicks
         */
        function setupClickHandlers() {
            postLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const articleKey = link.dataset.article;

                    if (articleKey) {
                        loadArticle(articleKey);
                        // Update URL without reload
                        history.pushState({ article: articleKey }, '', `#${articleKey}`);
                    }
                });
            });
        }

        /**
         * Handle browser navigation
         */
        function setupNavigationHandlers() {
            // Handle browser back/forward
            window.addEventListener('popstate', (e) => {
                if (e.state && e.state.article) {
                    loadArticle(e.state.article);
                } else {
                    // Load from hash if no state
                    const hash = window.location.hash.substring(1);
                    if (hash && window.writingContent[hash]) {
                        loadArticle(hash);
                    }
                }
            });
        }

        /**
         * Initialize from URL
         */
        function loadInitialArticle() {
            const hash = window.location.hash.substring(1);
            if (hash && window.writingContent[hash]) {
                loadArticle(hash);
            }
        }

        // Initialize all components
        setupClickHandlers();
        setupNavigationHandlers();
        loadInitialArticle();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWritingSPA);
    } else {
        initWritingSPA();
    }

})();