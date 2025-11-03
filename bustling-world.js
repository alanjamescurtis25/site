/**
 * The Bustling World / Three Kingdoms Interactive System
 * 삼국지 8 스타일 인터랙티브 시스템
 */

class BustlingWorld {
    constructor() {
        this.currentPersona = null;
        this.isFirstVisit = !localStorage.getItem('bustling_world_visited');
        this.dayCount = parseInt(localStorage.getItem('bustling_world_days') || '1');
        this.goldCount = parseInt(localStorage.getItem('bustling_world_gold') || '1000');

        this.personaData = {
            founder: {
                name: 'Warlord',
                icon: '⚔',
                role: 'The Warlord',
                theme: {
                    primary: '#2a1810',
                    accent: '#8b4513',
                    text: '#e8dcc0',
                    bg: '#1a0f08'
                },
                content: {
                    welcome: "Welcome to my stronghold! As a military strategist and founder, I've conquered markets and built digital empires. Each venture is a campaign, each product a victory.",
                    bio: "Battle-tested founder with five successful campaigns (exits) and over $100M in war chest raised.",
                    ending: "Join my legion - together we shall conquer new territories!"
                }
            },
            operator: {
                name: 'Strategist',
                icon: '♟',
                role: 'The Strategist',
                theme: {
                    primary: '#1a1a2e',
                    accent: '#f39c12',
                    text: '#ecf0f1',
                    bg: '#0f0f1c'
                },
                content: {
                    welcome: "Greetings, fellow tactician. Here you'll find systematic approaches to complex problems. Every system has its optimal configuration - let me show you the patterns.",
                    bio: "Operational excellence through precision and systems thinking. Former COO at EigenLayer, CTO at Core Scientific.",
                    ending: "May your strategies be sound and your execution flawless."
                }
            },
            investor: {
                name: 'Merchant',
                icon: '💰',
                role: 'The Merchant',
                theme: {
                    primary: '#f4e4c1',
                    accent: '#d4af37',
                    text: '#2c1810',
                    bg: '#faf6ed'
                },
                content: {
                    welcome: "Welcome to my trading post! Gold flows where wisdom dwells. I've funded kingdoms and watched empires rise. Let's discuss profitable ventures.",
                    bio: "Investor and deal-maker, finding treasures in the digital realm. Portfolio spans from seed to scale.",
                    ending: "May your investments multiply like grain in a good harvest."
                }
            },
            dad: {
                name: 'Scholar',
                icon: '📖',
                role: 'The Scholar',
                theme: {
                    primary: '#f5f5dc',
                    accent: '#cd5c5c',
                    text: '#3a3a3a',
                    bg: '#fdfdf5'
                },
                content: {
                    welcome: "Welcome to my study. Here, wisdom is shared freely and knowledge compounds. As a father and teacher, I believe in nurturing potential.",
                    bio: "Father, mentor, and lifelong student. Building not just companies but also character.",
                    ending: "Remember: true wealth is measured in relationships and impact."
                }
            }
        };

        this.init();
    }

    init() {
        // Check if first visit
        if (this.isFirstVisit) {
            this.showCharacterSelection();
        } else {
            // Load saved persona
            const savedPersona = localStorage.getItem('bustling_world_persona') || 'founder';
            this.setPersona(savedPersona, false);
            this.hideCharacterSelection();
            this.showMainContent();
        }

        // Set up event listeners
        this.setupEventListeners();

        // Initialize mobile menu
        this.setupMobileMenu();

        // Update game stats
        this.updateGameStats();

        // Increment day count on visit
        this.incrementDayCount();
    }

    setupEventListeners() {
        // Character selection cards
        const characterCards = document.querySelectorAll('.character-card');
        characterCards.forEach(card => {
            card.addEventListener('click', (e) => {
                const persona = card.dataset.persona;
                this.selectCharacter(persona);
            });
        });

        // Persona switcher - with better dropdown handling
        const dropdownItems = document.querySelectorAll('.menu-item:not(.reset-btn)');
        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const persona = item.dataset.persona;
                if (persona) {
                    this.switchPersona(persona);
                }
            });
        });

        // Reset button
        const resetBtn = document.getElementById('resetSelection');
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetToCharacterSelection();
            });
        }

        // Keyboard shortcut to reset (Ctrl/Cmd + Shift + R)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                this.resetToCharacterSelection();
            }
        });

        // Navigation links (remove page reload)
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').startsWith('/') && link.getAttribute('href') !== '/') {
                    e.preventDefault();
                    this.loadPageContent(link.getAttribute('href'));

                    // Update active state immediately
                    navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });
    }

    showCharacterSelection() {
        const modal = document.getElementById('characterSelect');
        modal.classList.remove('hidden');
    }

    hideCharacterSelection() {
        const modal = document.getElementById('characterSelect');
        modal.classList.add('hidden');
    }

    selectCharacter(persona) {
        // Save first visit flag
        localStorage.setItem('bustling_world_visited', 'true');
        localStorage.setItem('bustling_world_persona', persona);

        // Apply persona theme
        this.setPersona(persona, false);

        // Hide modal and show content immediately
        this.hideCharacterSelection();
        this.showMainContent();
    }

    showMainContent() {
        const container = document.getElementById('mainContainer');
        container.classList.add('loaded');

        const switcher = document.getElementById('personaSwitcher');
        switcher.classList.remove('hidden');
    }

    setPersona(persona, animate = false) {
        if (!this.personaData[persona]) return;

        this.currentPersona = persona;
        const data = this.personaData[persona];

        // Remove transition class for instant change
        if (!animate) {
            document.body.classList.add('no-transition');
        }

        // Apply theme class to body
        document.body.className = `persona-${persona}${!animate ? ' no-transition' : ''}`;

        // Update persona switcher icon
        const switcherIcon = document.querySelector('.current-persona-icon');
        if (switcherIcon) {
            switcherIcon.textContent = data.icon;
        }

        // Update current role
        const currentRole = document.getElementById('currentRole');
        if (currentRole) {
            currentRole.textContent = data.role;
        }

        // Update content based on persona
        this.updatePersonaContent(persona);

        // Update CSS variables
        const root = document.documentElement;
        root.style.setProperty('--primary-color', data.theme.primary);
        root.style.setProperty('--accent-color', data.theme.accent);
        root.style.setProperty('--text-color', data.theme.text);
        root.style.setProperty('--bg-color', data.theme.bg);

        // Remove transition class after a frame
        if (!animate) {
            setTimeout(() => {
                document.body.classList.remove('no-transition');
            }, 50);
        }
    }

    updatePersonaContent(persona) {
        const data = this.personaData[persona];
        const contentBody = document.getElementById('contentBody');

        if (contentBody && window.location.pathname === '/' || window.location.pathname === '/index.html') {
            contentBody.innerHTML = `
                <p class="intro-text">${data.content.welcome}</p>
                <p>${data.content.bio}</p>
                <p>A good place to start is with my <a href="/bio.html" class="text-link">chronicles</a>,
                my <a href="/writing/user-manual.html" class="text-link">manual</a>,
                or my <a href="/writing/latticework.html" class="text-link">framework</a>.</p>
                <p>${data.content.ending}</p>
                <p>Reach out on <a href="https://twitter.com/alanjamescurtis" target="_blank" class="text-link">X</a>,
                <a href="https://linkedin.com/in/alanjamescurtis" target="_blank" class="text-link">LinkedIn</a>,
                or <a href="mailto:alanjamescurtis@gmail.com" class="text-link">email</a> if we should be working together!</p>
            `;
        }

        // Update page title based on persona
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            const titles = {
                founder: 'Welcome to the War Room',
                operator: 'Strategic Operations Center',
                investor: 'The Trading Hall',
                dad: 'The Scholar\'s Study'
            };
            pageTitle.textContent = titles[persona] || 'Welcome';
        }
    }

    switchPersona(persona) {
        if (persona === this.currentPersona) return;

        localStorage.setItem('bustling_world_persona', persona);
        this.setPersona(persona, false); // No animation for instant switch
    }

    incrementDayCount() {
        // Only increment once per session
        if (!sessionStorage.getItem('day_incremented')) {
            this.dayCount++;
            localStorage.setItem('bustling_world_days', this.dayCount.toString());
            sessionStorage.setItem('day_incremented', 'true');

            // Add gold each day
            this.goldCount += 100;
            localStorage.setItem('bustling_world_gold', this.goldCount.toString());

            this.updateGameStats();
        }
    }

    updateGameStats() {
        const dayElement = document.getElementById('dayCount');
        const goldElement = document.getElementById('goldCount');

        if (dayElement) dayElement.textContent = this.dayCount.toString();
        if (goldElement) goldElement.textContent = this.goldCount.toLocaleString();
    }

    setupMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const sidebar = document.querySelector('.sidebar');

        if (hamburger) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                sidebar.classList.toggle('open');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
                    hamburger.classList.remove('active');
                    sidebar.classList.remove('open');
                }
            });
        }
    }

    loadPageContent(url) {
        // Simple page content update without reload
        const contentBody = document.getElementById('contentBody');
        const pageTitle = document.getElementById('pageTitle');

        const pageTitles = {
            '/': this.getPersonaPageTitle(),
            '/bio.html': 'Chronicles of Achievement',
            '/writing.html': 'Ancient Scrolls',
            '/quotes.html': 'Words of Wisdom',
            '/questions.html': 'Inquiries & Mysteries',
            '/investments.html': 'The Royal Treasury'
        };

        if (pageTitle) {
            pageTitle.textContent = pageTitles[url] || 'Welcome';
        }

        // Update content based on page
        if (url === '/' && contentBody) {
            this.updatePersonaContent(this.currentPersona);
        }
    }

    getPersonaPageTitle() {
        const titles = {
            founder: 'Welcome to the War Room',
            operator: 'Strategic Operations Center',
            investor: 'The Trading Hall',
            dad: 'The Scholar\'s Study'
        };
        return titles[this.currentPersona] || 'Welcome';
    }

    resetToCharacterSelection() {
        // Clear localStorage
        localStorage.removeItem('bustling_world_visited');
        localStorage.removeItem('bustling_world_persona');

        // Reset state
        this.isFirstVisit = true;
        this.currentPersona = null;

        // Hide main content and switcher
        const container = document.getElementById('mainContainer');
        container.classList.remove('loaded');

        const switcher = document.getElementById('personaSwitcher');
        switcher.classList.add('hidden');

        // Show character selection
        this.showCharacterSelection();
    }
}

// Initialize the system when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.bustlingWorld = new BustlingWorld();
    });
} else {
    window.bustlingWorld = new BustlingWorld();
}