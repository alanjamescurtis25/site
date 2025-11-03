/**
 * Premium RTK8 Interactive System
 * AAA Game-Grade Interaction Design
 */

class PremiumRTK8 {
    constructor() {
        this.currentArchetype = null;
        this.isFirstVisit = !localStorage.getItem('rtk8_visited');

        this.archetypeData = {
            founder: {
                name: 'Warlord',
                badge: 'WARLORD',
                color: '#dc143c',
                content: {
                    welcome: "Welcome to my domain. As a battle-tested commander, I've conquered markets and built digital empires. Five successful campaigns, over $100M in resources marshaled.",
                    focus: "Strategic expansion, market domination, and empire building.",
                    ending: "Join my war council. Together, we shall forge new frontiers."
                }
            },
            operator: {
                name: 'Strategist',
                badge: 'STRATEGIST',
                color: '#5e72e4',
                content: {
                    welcome: "Greetings. I architect systems with surgical precision. Former COO at EigenLayer, CTO at Core Scientific. Every challenge has an optimal solution.",
                    focus: "Operational excellence, scalable architecture, and systematic growth.",
                    ending: "Let us devise strategies that turn complexity into competitive advantage."
                }
            },
            investor: {
                name: 'Merchant',
                badge: 'MERCHANT',
                color: '#ffd700',
                content: {
                    welcome: "Welcome to my trading hall. I transform opportunities into wealth, identifying value where others see risk. Portfolio spans from seed to scale.",
                    focus: "Capital efficiency, portfolio construction, and value creation.",
                    ending: "Great fortunes await those who recognize opportunity. Let us discuss."
                }
            },
            dad: {
                name: 'Scholar',
                badge: 'SCHOLAR',
                color: '#4caf50',
                content: {
                    welcome: "Welcome, friend. Beyond titles and achievements, I'm a father and lifelong student. True wealth lies in wisdom shared and relationships nurtured.",
                    focus: "Mentorship, knowledge transfer, and human-centered leadership.",
                    ending: "The greatest returns come from investing in people. How may I help?"
                }
            }
        };

        this.init();
    }

    init() {
        // Check first visit
        if (this.isFirstVisit) {
            this.showCharacterSelection();
        } else {
            const savedArchetype = localStorage.getItem('rtk8_archetype') || 'founder';
            this.setArchetype(savedArchetype, false);
            this.hideCharacterSelection();
            this.showMainApp();
        }

        this.setupEventListeners();
        this.initMobileMenu();
    }

    setupEventListeners() {
        // Character selection cards
        const characterOptions = document.querySelectorAll('.character-option');
        characterOptions.forEach(option => {
            option.addEventListener('click', () => {
                const archetype = option.dataset.persona;
                this.selectCharacter(archetype);
            });
        });

        // Archetype switcher menu
        const archetypeOptions = document.querySelectorAll('.archetype-option:not(.reset-option)');
        archetypeOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const archetype = option.dataset.persona;
                if (archetype) {
                    this.switchArchetype(archetype);
                }
            });
        });

        // Reset button
        const resetBtn = document.getElementById('resetArchetype');
        if (resetBtn) {
            resetBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetToCharacterSelection();
            });
        }

        // Navigation links (prevent reload)
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href') === '#' || link.getAttribute('href') === '/') {
                    e.preventDefault();
                    this.updateActiveNav(link);
                }
            });
        });

        // Keyboard shortcut for reset
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'R') {
                e.preventDefault();
                this.resetToCharacterSelection();
            }
        });
    }

    showCharacterSelection() {
        const selectScreen = document.getElementById('characterSelect');
        selectScreen.classList.remove('hidden');

        // Add entrance animation
        setTimeout(() => {
            const options = document.querySelectorAll('.character-option');
            options.forEach((option, index) => {
                option.style.opacity = '0';
                option.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    option.style.transition = 'all 0.5s ease';
                    option.style.opacity = '1';
                    option.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 100);
    }

    hideCharacterSelection() {
        const selectScreen = document.getElementById('characterSelect');
        selectScreen.classList.add('hidden');
    }

    selectCharacter(archetype) {
        localStorage.setItem('rtk8_visited', 'true');
        localStorage.setItem('rtk8_archetype', archetype);

        this.setArchetype(archetype, false);
        this.hideCharacterSelection();
        this.showMainApp();
    }

    showMainApp() {
        const mainApp = document.getElementById('mainApp');
        mainApp.classList.add('active');

        const switcher = document.getElementById('archetypeSwitcher');
        switcher.classList.remove('hidden');
    }

    setArchetype(archetype, animate = true) {
        if (!this.archetypeData[archetype]) return;

        this.currentArchetype = archetype;
        const data = this.archetypeData[archetype];

        // Update archetype badge
        const badge = document.getElementById('archetypeBadge');
        if (badge) {
            badge.textContent = data.badge;
            badge.style.borderColor = data.color + '40';
        }

        // Update current archetype icon
        const currentIcon = document.querySelector('.current-archetype-icon');
        if (currentIcon) {
            currentIcon.style.background = data.color;
        }

        // Update content
        this.updateContent(archetype);

        // Update CSS variables for theme
        const root = document.documentElement;
        root.style.setProperty('--current-accent', data.color);
    }

    updateContent(archetype) {
        const data = this.archetypeData[archetype];
        const contentBody = document.getElementById('contentBody');

        if (contentBody) {
            contentBody.innerHTML = `
                <div class="intro-section">
                    <p class="lead-text">${data.content.welcome}</p>
                </div>

                <div class="content-section">
                    <p><strong>Current Focus:</strong> ${data.content.focus}</p>
                </div>

                <div class="content-section">
                    <p>Explore my <a href="/bio.html" class="premium-link">chronicle</a> to understand my journey,
                    review my <a href="/writing/user-manual.html" class="premium-link">operating manual</a> for collaboration insights,
                    or study my <a href="/writing/latticework.html" class="premium-link">mental models</a> for strategic thinking.</p>
                </div>

                <div class="contact-section">
                    <p>${data.content.ending}</p>
                    <p>Connect: <a href="https://twitter.com/alanjamescurtis" target="_blank" class="premium-link">X</a> |
                    <a href="https://linkedin.com/in/alanjamescurtis" target="_blank" class="premium-link">LinkedIn</a> |
                    <a href="mailto:alanjamescurtis@gmail.com" class="premium-link">Email</a></p>
                </div>
            `;
        }

        // Update page title
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            const titles = {
                founder: 'Welcome to the War Room',
                operator: 'Strategic Operations Center',
                investor: 'The Trading Floor',
                dad: 'The Scholar\'s Sanctuary'
            };
            pageTitle.textContent = titles[archetype] || 'Welcome';
        }
    }

    switchArchetype(archetype) {
        if (archetype === this.currentArchetype) return;

        localStorage.setItem('rtk8_archetype', archetype);
        this.setArchetype(archetype, true);
    }

    resetToCharacterSelection() {
        localStorage.removeItem('rtk8_visited');
        localStorage.removeItem('rtk8_archetype');

        this.currentArchetype = null;

        const mainApp = document.getElementById('mainApp');
        mainApp.classList.remove('active');

        const switcher = document.getElementById('archetypeSwitcher');
        switcher.classList.add('hidden');

        this.showCharacterSelection();
    }

    updateActiveNav(activeLink) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    initMobileMenu() {
        const mobileToggle = document.getElementById('mobileToggle');
        const navMenu = document.getElementById('navMenu');

        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            });
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.premiumRTK8 = new PremiumRTK8();
    });
} else {
    window.premiumRTK8 = new PremiumRTK8();
}