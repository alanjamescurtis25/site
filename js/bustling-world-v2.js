/**
 * The Bustling World v2 - Character Selection System
 * Professional Game-Inspired Portfolio JavaScript
 */

class BustlingWorldV2 {
    constructor() {
        // State management
        this.currentPersona = null;
        this.isFirstVisit = !localStorage.getItem('bustling_v2_visited');

        // Persona configuration
        this.personaData = {
            founder: {
                name: 'Founder',
                theme: 'persona-founder',
                image: '/assets/alan-2.jpeg',
                content: {
                    title: 'Welcome to the War Room',
                    welcome: "Welcome, fellow builder! I'm a five-time founder with successful exits, over $100M raised, and a passion for creating companies that matter.",
                    focus: "Currently focusing on strategic investments, advising founders, and building the next generation of digital infrastructure.",
                    ending: "Let's build something extraordinary together."
                }
            },
            operator: {
                name: 'Operator',
                theme: 'persona-operator',
                image: '/assets/alan-1.jpg',
                content: {
                    title: 'Strategic Operations Center',
                    welcome: "Systems thinking meets execution. Former COO at EigenLayer and CTO at Core Scientific, I specialize in scaling operations from startup to enterprise.",
                    focus: "Building robust systems, optimizing processes, and turning chaos into order at scale.",
                    ending: "Let's architect systems that scale effortlessly."
                }
            },
            investor: {
                name: 'Investor',
                theme: 'persona-investor',
                image: '/assets/alan-3.jpg',
                content: {
                    title: 'The Trading Hall',
                    welcome: "Capital allocation is both art and science. As an active investor and advisor, I help founders navigate from seed to scale.",
                    focus: "Pattern recognition, portfolio construction, and helping exceptional founders build category-defining companies.",
                    ending: "The best investments are partnerships. Let's explore possibilities."
                }
            },
            dad: {
                name: 'Dad',
                theme: 'persona-dad',
                image: '/assets/alan-4.jpg',
                content: {
                    title: "The Scholar's Sanctuary",
                    welcome: "Hey there! Beyond all the titles and ventures, I'm a dad first. Life's greatest ROI comes from family, relationships, and helping others grow.",
                    focus: "Balancing ambition with presence, sharing hard-won wisdom, and keeping perspective on what truly matters.",
                    ending: "Success is measured in moments, not metrics. How can I help?"
                }
            }
        };

        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        const path = window.location.pathname;
        const isIndexPage = path === '/' || path === '/index.html' || path.endsWith('/index.html');

        // Check if reset parameter is in URL
        const urlParams = new URLSearchParams(window.location.search);
        const shouldReset = urlParams.get('reset') === 'true';

        if (shouldReset) {
            // Clear the reset parameter from URL
            window.history.replaceState({}, document.title, window.location.pathname);
            // Clear localStorage
            localStorage.removeItem('bustling_v2_visited');
            localStorage.removeItem('bustling_v2_persona');
            this.isFirstVisit = true;
        }

        // Check first visit status
        if (this.isFirstVisit) {
            if (isIndexPage) {
                this.showCharacterSelection();
            } else {
                // If first visit on a non-index page, redirect to index for character selection
                window.location.href = '/?reset=true';
            }
        } else {
            const savedPersona = localStorage.getItem('bustling_v2_persona') || 'founder';
            this.setPersona(savedPersona);
            this.hideCharacterSelection();
            this.showMainContent();
        }

        this.setupEventListeners();
        this.setupMobileMenu();
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Character selection cards
        this.setupCharacterSelection();

        // Persona switcher
        this.setupPersonaSwitcher();

        // Navigation links
        this.setupNavigation();

        // Keyboard shortcuts
        this.setupKeyboardShortcuts();
    }

    /**
     * Setup character selection cards
     */
    setupCharacterSelection() {
        const characterCards = document.querySelectorAll('.character-card');
        characterCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Only allow direct card selection on desktop
                // On mobile, users must use the Select Role button
                if (window.innerWidth > 768) {
                    const persona = card.dataset.persona;
                    this.selectCharacter(persona);
                }
            });

            // Setup video hover effect for Founder card
            if (card.dataset.persona === 'founder') {
                const video = card.querySelector('.character-video');
                if (video) {
                    // Play video on hover
                    card.addEventListener('mouseenter', () => {
                        video.play().catch(e => {
                            console.log('Video play failed:', e);
                        });
                    });

                    // Pause and reset video when hover ends
                    card.addEventListener('mouseleave', () => {
                        video.pause();
                        video.currentTime = 0;
                    });
                }
            }
        });
    }

    /**
     * Setup persona switcher with horizontal hover icons
     */
    setupPersonaSwitcher() {
        const personaSwitcher = document.getElementById('personaSwitcher');
        if (!personaSwitcher) return;

        // Desktop: Handle horizontal icon buttons
        const iconBtns = personaSwitcher.querySelectorAll('.persona-icon-btn');
        iconBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const persona = btn.dataset.persona;
                if (persona) {
                    // Update current role indicator
                    iconBtns.forEach(b => b.classList.remove('current-role'));
                    btn.classList.add('current-role');
                    this.switchPersona(persona);
                }
            });
        });

        // Mobile: Keep dropdown functionality
        const dropdown = personaSwitcher.querySelector('.persona-dropdown.mobile-only');
        const personaBtn = personaSwitcher.querySelector('.persona-btn');
        let hoverTimeout = null;

        // Mobile dropdown on click
        if (window.innerWidth <= 768) {
            if (personaBtn && dropdown) {
                personaBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const isVisible = dropdown.style.visibility === 'visible';
                    if (isVisible) {
                        dropdown.style.opacity = '0';
                        dropdown.style.visibility = 'hidden';
                    } else {
                        dropdown.style.opacity = '1';
                        dropdown.style.visibility = 'visible';
                    }
                });

                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    if (!personaSwitcher.contains(e.target)) {
                        dropdown.style.opacity = '0';
                        dropdown.style.visibility = 'hidden';
                    }
                });
            }
        }

        // Mobile dropdown items
        const dropdownItems = document.querySelectorAll('.dropdown-item:not(.reset-btn)');
        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const persona = item.dataset.persona;
                if (persona) {
                    this.switchPersona(persona);
                    // Close dropdown after selection
                    if (dropdown) {
                        dropdown.style.opacity = '0';
                        dropdown.style.visibility = 'hidden';
                    }
                }
            });
        });

        // Reset button (mobile)
        const resetBtn = document.getElementById('resetSelection');
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetToCharacterSelection();
            });
        }

        // Update current role indicator on load
        const currentPersona = localStorage.getItem('bustling_v2_persona') || 'founder';
        iconBtns.forEach(btn => {
            btn.classList.remove('current-role');
            if (btn.dataset.persona === currentPersona) {
                btn.classList.add('current-role');
            }
        });
    }

    /**
     * Setup navigation links
     */
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        const path = window.location.pathname;
        const isIndexPage = path === '/' || path === '/index.html' || path.endsWith('/index.html');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                // Only prevent default on index page for home link
                if (isIndexPage && href === '/') {
                    e.preventDefault();
                    // Update active state
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    // Update content for home page
                    this.updatePersonaContent();
                }
                // For other pages, let the navigation happen naturally
                // The browser will handle the navigation to other pages
            });
        });
    }

    /**
     * Setup keyboard shortcuts
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Shift+R to reset character selection
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                this.resetToCharacterSelection();
            }
        });
    }

    /**
     * Setup mobile menu functionality
     */
    setupMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const sidebar = document.querySelector('.sidebar');

        if (!hamburger || !sidebar) return;

        hamburger.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
                sidebar.classList.remove('open');
                hamburger.classList.remove('active');
            }
        });
    }

    /**
     * Show character selection modal
     */
    showCharacterSelection() {
        const modal = document.getElementById('characterSelect');
        const path = window.location.pathname;
        const isIndexPage = path === '/' || path === '/index.html' || path.endsWith('/index.html');

        if (modal) {
            modal.classList.remove('hidden');
        } else if (!isIndexPage) {
            // If we're not on the main page and there's no modal, redirect to main page with reset
            window.location.href = '/?reset=true';
        }
    }

    /**
     * Hide character selection modal
     */
    hideCharacterSelection() {
        const modal = document.getElementById('characterSelect');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    /**
     * Select a character and initialize the site
     * @param {string} persona - The selected persona
     */
    selectCharacter(persona) {
        // Save selection
        localStorage.setItem('bustling_v2_visited', 'true');
        localStorage.setItem('bustling_v2_persona', persona);

        // Apply persona
        this.setPersona(persona);

        // Transition to main content
        this.hideCharacterSelection();
        this.showMainContent();

        // After showing main content, load Welcome as the default page
        const isIndexPage = window.location.pathname === '/' || window.location.pathname === '/index.html';
        if (isIndexPage) {
            // Load Welcome content after character selection
            setTimeout(() => {
                if (window.loadPageContent) {
                    window.loadPageContent('welcome');
                }
            }, 500);
        }
    }

    /**
     * Show main content with fade-in
     */
    showMainContent() {
        const container = document.getElementById('mainContainer');
        if (container) {
            container.style.opacity = '1';
        }

        const switcher = document.getElementById('personaSwitcher');
        if (switcher) {
            switcher.classList.remove('hidden');
        }
    }

    /**
     * Set the current persona and update UI
     * @param {string} persona - The persona to set
     */
    setPersona(persona) {
        if (!this.personaData[persona]) return;

        this.currentPersona = persona;
        const data = this.personaData[persona];

        // Apply theme class to body
        document.body.className = data.theme;

        // Update persona badge
        const badge = document.getElementById('personaBadge');
        if (badge) {
            const badgeText = badge.querySelector('.badge-text');
            if (badgeText) {
                badgeText.textContent = data.name;
            }
        }

        // Update profile image in persona switcher
        const profileImg = document.getElementById('currentPersonaImage');
        if (profileImg) {
            profileImg.src = data.image;
            profileImg.alt = data.name;
        }

        // Update content
        this.updatePersonaContent();
    }

    /**
     * Update page content based on current persona
     */
    updatePersonaContent() {
        const data = this.personaData[this.currentPersona];
        if (!data) return;

        // Update page title
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.textContent = data.content.title;
        }

        // Update content body
        const contentBody = document.getElementById('contentBody');
        if (contentBody) {
            contentBody.innerHTML = `
                <p class="intro-text">${data.content.welcome}</p>

                <p><strong>Current Focus:</strong> ${data.content.focus}</p>

                <p>Begin with my <a href="/bio.html" class="text-link">chronicle</a> to understand my path,
                explore my <a href="/writing/user-manual.html" class="text-link">manual</a> for collaboration insights,
                or study my <a href="/writing/latticework.html" class="text-link">frameworks</a>.</p>

                <p>${data.content.ending}</p>

                <p>Connect through <a href="https://twitter.com/alanjamescurtis" target="_blank" class="text-link">X</a>,
                <a href="https://linkedin.com/in/alanjamescurtis" target="_blank" class="text-link">LinkedIn</a>,
                or <a href="mailto:alanjamescurtis@gmail.com" class="text-link">email</a> to explore opportunities.</p>
            `;
        }
    }

    /**
     * Switch to a different persona
     * @param {string} persona - The persona to switch to
     */
    switchPersona(persona) {
        if (persona === this.currentPersona) return;

        localStorage.setItem('bustling_v2_persona', persona);
        this.setPersona(persona);
    }

    /**
     * Reset to character selection screen
     */
    resetToCharacterSelection() {
        // Clear localStorage
        localStorage.removeItem('bustling_v2_visited');
        localStorage.removeItem('bustling_v2_persona');

        // Check if we're on the main page with character selection
        const modal = document.getElementById('characterSelect');
        if (modal) {
            // We're on the main page, show the modal
            this.currentPersona = null;

            // Hide main content
            const container = document.getElementById('mainContainer');
            if (container) {
                container.style.opacity = '0';
            }

            const switcher = document.getElementById('personaSwitcher');
            if (switcher) {
                switcher.classList.add('hidden');
            }

            // Show character selection
            this.showCharacterSelection();
        } else {
            // We're on a detail page, redirect to main page
            window.location.href = '/?reset=true';
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.bustlingWorldV2 = new BustlingWorldV2();
    });
} else {
    window.bustlingWorldV2 = new BustlingWorldV2();
}