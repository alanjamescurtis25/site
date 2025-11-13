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

            // Always show persona switcher on non-index pages
            if (!isIndexPage) {
                const switcher = document.getElementById('personaSwitcher');
                if (switcher) {
                    switcher.classList.remove('hidden');
                }
            } else {
                this.showMainContent();
            }
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

        const iconBtns = personaSwitcher.querySelectorAll('.persona-icon-btn');
        const personaBtn = personaSwitcher.querySelector('.persona-btn');
        const personaContainer = personaSwitcher.querySelector('.persona-icons-container');

        // Handle both desktop and mobile with icon navigation
        if (window.innerWidth <= 768) {
            // Mobile: Use tap to show/hide icons
            if (personaBtn && personaContainer) {
                // Remove any existing event listeners by cloning the button
                const newBtn = personaBtn.cloneNode(true);
                personaBtn.parentNode.replaceChild(newBtn, personaBtn);

                newBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Mobile persona button clicked - toggling show-options');
                    personaContainer.classList.toggle('show-options');
                });

                // Close when tapping outside - use setTimeout to prevent immediate trigger
                setTimeout(() => {
                    document.addEventListener('click', (e) => {
                        if (!personaContainer.contains(e.target)) {
                            console.log('Clicked outside - removing show-options');
                            personaContainer.classList.remove('show-options');
                        }
                    });
                }, 100);
            }
        }

        // Handle icon button clicks (both desktop and mobile)
        iconBtns.forEach((btn, index) => {
            const handleClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const persona = e.currentTarget.dataset.persona;
                console.log('Persona icon clicked:', persona);
                if (persona) {
                    // Update current role indicator using all buttons
                    const allBtns = personaSwitcher.querySelectorAll('.persona-icon-btn');
                    allBtns.forEach(b => b.classList.remove('current-role'));
                    e.currentTarget.classList.add('current-role');

                    // Update the main persona image
                    const currentImg = document.getElementById('currentPersonaImage');
                    const optionImg = e.currentTarget.querySelector('.persona-icon-img');
                    if (currentImg && optionImg) {
                        currentImg.src = optionImg.src;
                        currentImg.alt = optionImg.alt;
                    }

                    // Actually switch the persona
                    this.switchPersona(persona);

                    // On mobile, close the options after selection
                    if (window.innerWidth <= 768) {
                        setTimeout(() => {
                            personaContainer.classList.remove('show-options');
                        }, 300);
                    }
                }
            };

            // Add event listener directly
            btn.addEventListener('click', handleClick);
            // Add touch handler for mobile
            if (window.innerWidth <= 768) {
                btn.addEventListener('touchstart', handleClick, { passive: false });
            }
        });

        // Update current role indicator on load
        const currentPersona = localStorage.getItem('bustling_v2_persona') || 'founder';
        iconBtns.forEach(btn => {
            btn.classList.remove('current-role');
            if (btn.dataset.persona === currentPersona) {
                btn.classList.add('current-role');
            }
        });

        // Also update the main button image based on current persona
        const currentImg = document.getElementById('currentPersonaImage');
        if (currentImg) {
            const currentBtn = document.querySelector(`.persona-icon-btn[data-persona="${currentPersona}"]`);
            if (currentBtn) {
                const img = currentBtn.querySelector('.persona-icon-img');
                if (img) {
                    currentImg.src = img.src;
                    currentImg.alt = img.alt;
                }
            }
        }
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
        // Only setup mobile menu on mobile devices
        if (window.innerWidth > 768) return;

        // Use a small delay to ensure DOM is ready
        setTimeout(() => {
            const hamburger = document.getElementById('hamburger');
            const sidebar = document.querySelector('.sidebar');

            if (!hamburger || !sidebar) {
                console.log('Mobile menu elements not found - hamburger:', !!hamburger, 'sidebar:', !!sidebar);
                // Try again if elements not found
                setTimeout(() => this.setupMobileMenu(), 500);
                return;
            }

            // Debug hamburger visibility
            console.log('[BustlingWorld] Hamburger found, checking visibility...');
            const rect = hamburger.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(hamburger);
            console.log('[BustlingWorld] Hamburger details:', {
                position: rect,
                display: computedStyle.display,
                visibility: computedStyle.visibility,
                opacity: computedStyle.opacity,
                zIndex: computedStyle.zIndex,
                width: rect.width,
                height: rect.height,
                hasSpans: hamburger.querySelectorAll('span').length,
                parent: hamburger.parentElement ? hamburger.parentElement.tagName + '.' + hamburger.parentElement.className : 'body',
                computedLeft: computedStyle.left,
                computedTop: computedStyle.top
            });

            // Force position fix if needed
            if (rect.x < 0) {
                console.log('[BustlingWorld] Fixing hamburger position - was at x:', rect.x);
                hamburger.style.left = '15px !important';
                hamburger.style.position = 'fixed !important';
                hamburger.style.transform = 'none !important';
            }

            // Remove any existing event listeners by cloning
            const newHamburger = hamburger.cloneNode(true);
            hamburger.parentNode.replaceChild(newHamburger, hamburger);

            // Setup hamburger click handler directly on the DOM element
            const finalHamburger = document.getElementById('hamburger');
            finalHamburger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Hamburger clicked - toggling sidebar');
                sidebar.classList.toggle('open');
                finalHamburger.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });

            // Setup overlay click handler
            const overlay = document.querySelector('.menu-overlay');
            if (overlay) {
                overlay.addEventListener('click', () => {
                    console.log('Overlay clicked - closing sidebar');
                    sidebar.classList.remove('open');
                    finalHamburger.classList.remove('active');
                    document.body.classList.remove('menu-open');
                });
            }

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (sidebar.classList.contains('open') &&
                    !sidebar.contains(e.target) &&
                    !finalHamburger.contains(e.target)) {
                    console.log('Closing sidebar - clicked outside');
                    sidebar.classList.remove('open');
                    finalHamburger.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });

            // Close menu when clicking on a nav link
            const navLinks = sidebar.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        console.log('Nav link clicked - closing sidebar');
                        sidebar.classList.remove('open');
                        finalHamburger.classList.remove('active');
                        document.body.classList.remove('menu-open');
                    }
                });
            });

            console.log('Mobile menu setup complete');
        }, 100); // Close the setTimeout
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
            // Add class to body to indicate character selection is active (for mobile styling)
            document.body.classList.add('character-select-active');
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
            // Remove the character-select-active class
            document.body.classList.remove('character-select-active');
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

        // Update content only on index page
        const path = window.location.pathname;
        const isIndexPage = path === '/' || path === '/index.html' || path.endsWith('/index.html');
        if (isIndexPage) {
            this.updatePersonaContent();
        }
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
function initializeBustlingWorld() {
    window.bustlingWorldV2 = new BustlingWorldV2();

    // Note: Removed duplicate mobile persona initialization
    // It's already handled in the setupPersonaSwitcher method
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBustlingWorld);
} else {
    initializeBustlingWorld();
}