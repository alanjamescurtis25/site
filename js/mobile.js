/**
 * Mobile Interaction Handler
 * Touch events, swipe navigation, and mobile-specific functionality
 *
 * @author Alan James Curtis
 * @version 2.0.0
 */

(function() {
    'use strict';

    /**
     * Mobile Detection Utility
     */
    const MobileDetect = {
        isMobile: () => {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
                   window.innerWidth <= 768;
        },

        isTablet: () => {
            return /iPad|Android/i.test(navigator.userAgent) && window.innerWidth >= 768 && window.innerWidth <= 1024;
        },

        isTouchDevice: () => {
            return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        }
    };

    /**
     * Swipe Handler for Character Selection
     */
    class SwipeHandler {
        constructor(element, options = {}) {
            this.element = element;
            this.options = {
                threshold: options.threshold || 50,
                restraint: options.restraint || 100,
                allowedTime: options.allowedTime || 300,
                ...options
            };

            this.touchStartX = 0;
            this.touchStartY = 0;
            this.touchEndX = 0;
            this.touchEndY = 0;
            this.touchStartTime = 0;

            this.init();
        }

        init() {
            this.element.addEventListener('touchstart', this.handleStart.bind(this), { passive: true });
            this.element.addEventListener('touchend', this.handleEnd.bind(this), { passive: true });
        }

        handleStart(e) {
            const touch = e.touches[0];
            this.touchStartX = touch.pageX;
            this.touchStartY = touch.pageY;
            this.touchStartTime = new Date().getTime();
        }

        handleEnd(e) {
            const touch = e.changedTouches[0];
            this.touchEndX = touch.pageX;
            this.touchEndY = touch.pageY;

            const elapsedTime = new Date().getTime() - this.touchStartTime;

            if (elapsedTime <= this.options.allowedTime) {
                this.handleSwipe();
            }
        }

        handleSwipe() {
            const distX = this.touchEndX - this.touchStartX;
            const distY = this.touchEndY - this.touchStartY;

            if (Math.abs(distX) >= this.options.threshold && Math.abs(distY) <= this.options.restraint) {
                if (distX > 0) {
                    if (this.options.onSwipeRight) this.options.onSwipeRight();
                } else {
                    if (this.options.onSwipeLeft) this.options.onSwipeLeft();
                }
            }
        }
    }

    /**
     * Character Selection Mobile Enhancement
     */
    class CharacterSelectionMobile {
        constructor() {
            this.currentIndex = 0;
            this.cards = [];
            this.init();
        }

        init() {
            if (!MobileDetect.isMobile()) return;

            const grid = document.querySelector('.character-grid');
            if (!grid) return;

            this.cards = Array.from(document.querySelectorAll('.character-card'));
            if (this.cards.length === 0) return;

            // Restructure for mobile with thumbnails
            this.setupMobileLayout();

            // Setup thumbnail navigation
            this.setupThumbnails();

            // Setup swipe gestures
            this.setupSwipeGestures();

            // Auto-play videos on mobile
            this.autoPlayVideos();

            // Add mobile classes
            document.body.classList.add('is-mobile');
            if (MobileDetect.isTouchDevice()) {
                document.body.classList.add('is-touch');
            }
        }

        setupMobileLayout() {
            const grid = document.querySelector('.character-grid');

            // Create main display wrapper
            const mainDisplay = document.createElement('div');
            mainDisplay.className = 'character-main-display';

            // Move all cards to main display
            this.cards.forEach((card, index) => {
                if (index === 0) {
                    card.classList.add('active');
                    card.style.display = 'flex';
                } else {
                    card.classList.remove('active');
                    card.style.display = 'none';
                }
                mainDisplay.appendChild(card);
            });

            // Clear grid and add main display
            grid.appendChild(mainDisplay);

            // Create thumbnail navigation
            const thumbnails = document.createElement('div');
            thumbnails.className = 'character-thumbnails';

            const characterData = [
                { persona: 'founder', name: 'Founder', image: '/assets/alan-2.jpeg' },
                { persona: 'operator', name: 'Operator', image: '/assets/alan-3.jpg' },
                { persona: 'investor', name: 'Investor', image: '/assets/alan-1.jpg' },
                { persona: 'dad', name: 'Dad', image: '/assets/alan-4.jpg' }
            ];

            characterData.forEach((data, index) => {
                const thumb = document.createElement('div');
                thumb.className = 'character-thumbnail';
                if (index === 0) thumb.classList.add('active');
                thumb.dataset.index = index;

                const img = document.createElement('img');
                img.src = data.image;
                img.alt = data.name;
                thumb.appendChild(img);

                const name = document.createElement('div');
                name.className = 'thumb-name';
                name.textContent = data.name;
                thumb.appendChild(name);

                thumbnails.appendChild(thumb);
            });

            grid.appendChild(thumbnails);
        }

        setupThumbnails() {
            const thumbnails = document.querySelectorAll('.character-thumbnail');

            thumbnails.forEach((thumb, index) => {
                thumb.addEventListener('click', () => {
                    this.switchToCard(index);
                });
            });
        }

        switchToCard(index) {
            if (index === this.currentIndex) return;

            // Hide ALL cards first
            this.cards.forEach(card => {
                card.classList.remove('active');
                card.style.display = 'none';
            });

            // Remove active from all thumbnails
            document.querySelectorAll('.character-thumbnail').forEach(thumb => {
                thumb.classList.remove('active');
            });

            // Show ONLY the selected card
            this.cards[index].classList.add('active');
            this.cards[index].style.display = 'flex';
            document.querySelectorAll('.character-thumbnail')[index].classList.add('active');

            this.currentIndex = index;

            // Auto-play video for new card if it's Founder
            const newCard = this.cards[index];
            if (newCard.dataset.persona === 'founder') {
                const video = newCard.querySelector('.character-video');
                if (video) {
                    video.play().catch(() => {});
                }
            }
        }

        setupSwipeGestures() {
            const mainDisplay = document.querySelector('.character-main-display');
            if (!mainDisplay) return;

            new SwipeHandler(mainDisplay, {
                onSwipeLeft: () => {
                    const nextIndex = (this.currentIndex + 1) % this.cards.length;
                    this.switchToCard(nextIndex);
                },
                onSwipeRight: () => {
                    const prevIndex = (this.currentIndex - 1 + this.cards.length) % this.cards.length;
                    this.switchToCard(prevIndex);
                }
            });
        }

        setupSwipeNavigation(grid) {
            // Add scroll snap
            grid.style.scrollSnapType = 'x mandatory';
            grid.style.webkitOverflowScrolling = 'touch';

            // Update indicators on scroll
            grid.addEventListener('scroll', this.updateScrollIndicators.bind(this));

            // Add swipe handler
            new SwipeHandler(grid, {
                onSwipeLeft: () => this.navigateToCard(this.currentIndex + 1),
                onSwipeRight: () => this.navigateToCard(this.currentIndex - 1)
            });
        }

        navigateToCard(index) {
            if (index < 0 || index >= this.cards.length) return;

            this.currentIndex = index;
            const card = this.cards[index];
            card.scrollIntoView({ behavior: 'smooth', inline: 'center' });
        }

        setupScrollIndicators() {
            const container = document.querySelector('.character-select-modal');
            if (!container) return;

            const indicators = document.createElement('div');
            indicators.className = 'scroll-indicators';

            this.cards.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.className = 'scroll-dot';
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => this.navigateToCard(index));
                indicators.appendChild(dot);
            });

            container.appendChild(indicators);
            this.indicators = indicators.querySelectorAll('.scroll-dot');
        }

        updateScrollIndicators() {
            const grid = document.querySelector('.character-grid');
            const scrollLeft = grid.scrollLeft;
            const cardWidth = this.cards[0].offsetWidth + 20; // Including gap

            const newIndex = Math.round(scrollLeft / cardWidth);
            if (newIndex !== this.currentIndex) {
                this.currentIndex = newIndex;

                this.indicators.forEach((dot, index) => {
                    dot.classList.toggle('active', index === this.currentIndex);
                });
            }
        }

        autoPlayVideos() {
            const videos = document.querySelectorAll('.character-video');
            videos.forEach(video => {
                if (video) {
                    video.autoplay = true;
                    video.muted = true;
                    video.playsInline = true;
                    video.loop = true;
                    video.play().catch(() => {
                        // Silent fail
                    });
                }
            });
        }
    }

    /**
     * Mobile Navigation Handler
     */
    class MobileNavigation {
        constructor() {
            this.init();
        }

        init() {
            if (!MobileDetect.isMobile()) return;

            this.setupMobileHeader();
            this.setupHamburgerMenu();
            this.setupListToggle();
            this.preventBodyScroll();
        }

        setupMobileHeader() {
            // Don't add header if character selection is active
            if (document.querySelector('.character-select-overlay:not(.hidden)')) {
                // But still ensure hamburger exists for other pages
                let hamburger = document.getElementById('hamburger');
                if (!hamburger) {
                    hamburger = document.createElement('button');
                    hamburger.id = 'hamburger';
                    hamburger.className = 'hamburger';
                    hamburger.setAttribute('aria-label', 'Menu');
                    hamburger.innerHTML = '<span></span><span></span><span></span>';
                    document.body.appendChild(hamburger);
                }
                return;
            }

            // Create mobile header if it doesn't exist
            if (!document.querySelector('.mobile-header')) {
                const header = document.createElement('div');
                header.className = 'mobile-header';

                // Add hamburger menu if it doesn't exist
                let hamburger = document.getElementById('hamburger');
                if (!hamburger) {
                    hamburger = document.createElement('button');
                    hamburger.id = 'hamburger';
                    hamburger.className = 'hamburger';
                    hamburger.setAttribute('aria-label', 'Menu');
                    hamburger.innerHTML = '<span></span><span></span><span></span>';
                    document.body.appendChild(hamburger);
                }

                // Add site title
                const mobileTitle = document.createElement('div');
                mobileTitle.className = 'mobile-site-title';
                mobileTitle.textContent = 'Alan James Curtis';
                header.appendChild(mobileTitle);

                // Move persona switcher to header
                const personaSwitcher = document.querySelector('.persona-switcher');
                if (personaSwitcher) {
                    header.appendChild(personaSwitcher);
                }

                // Add header to body
                document.body.insertBefore(header, document.body.firstChild);
            }

            // Add menu overlay
            if (!document.querySelector('.menu-overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'menu-overlay';
                document.body.appendChild(overlay);
            }
        }

        setupHamburgerMenu() {
            // Try both hamburger selectors
            const hamburger = document.getElementById('hamburger') || document.querySelector('.hamburger');
            const sidebar = document.querySelector('.sidebar');

            if (!hamburger || !sidebar) {
                console.log('Hamburger menu setup failed - hamburger:', !!hamburger, 'sidebar:', !!sidebar);
                return;
            }

            // Remove any existing listeners
            const newHamburger = hamburger.cloneNode(true);
            hamburger.parentNode.replaceChild(newHamburger, hamburger);

            newHamburger.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                sidebar.classList.toggle('open');
                newHamburger.classList.toggle('active');
                document.body.classList.toggle('menu-open');
                console.log('Menu toggled - sidebar open:', sidebar.classList.contains('open'));
            });

            // Close menu on outside click
            document.addEventListener('click', (e) => {
                const currentHamburger = document.getElementById('hamburger') || document.querySelector('.hamburger');
                if (!sidebar.contains(e.target) && !currentHamburger.contains(e.target)) {
                    sidebar.classList.remove('open');
                    currentHamburger.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });

            // Close menu on navigation
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    const currentHamburger = document.getElementById('hamburger') || document.querySelector('.hamburger');
                    sidebar.classList.remove('open');
                    currentHamburger.classList.remove('active');
                    document.body.classList.remove('menu-open');
                });
            });
        }

        setupListToggle() {
            const listPane = document.querySelector('.list-pane');
            if (!listPane) return;

            const toggle = document.createElement('div');
            toggle.className = 'list-toggle';
            toggle.innerHTML = '<span>Articles</span>';

            listPane.insertBefore(toggle, listPane.firstChild);

            toggle.addEventListener('click', () => {
                listPane.classList.toggle('collapsed');
            });
        }

        preventBodyScroll() {
            // Prevent body scroll when menu is open
            const sidebar = document.querySelector('.sidebar');
            if (!sidebar) return;

            const observer = new MutationObserver(() => {
                if (sidebar.classList.contains('open')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });

            observer.observe(sidebar, {
                attributes: true,
                attributeFilter: ['class']
            });
        }
    }

    /**
     * Touch Feedback Enhancement
     */
    class TouchFeedback {
        constructor() {
            this.init();
        }

        init() {
            if (!MobileDetect.isTouchDevice()) return;

            // Add touch feedback to interactive elements
            const elements = document.querySelectorAll('a, button, .touchable');

            elements.forEach(element => {
                element.addEventListener('touchstart', () => {
                    element.classList.add('touch-active');
                });

                element.addEventListener('touchend', () => {
                    setTimeout(() => {
                        element.classList.remove('touch-active');
                    }, 300);
                });
            });
        }
    }

    /**
     * Initialize Mobile Features
     */
    function initMobile() {
        // Only run on mobile devices
        if (!MobileDetect.isMobile() && !MobileDetect.isTablet()) {
            return;
        }

        // Initialize mobile features
        new CharacterSelectionMobile();
        new MobileNavigation();
        new TouchFeedback();

        // Add viewport meta if not present
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes';
            document.head.appendChild(viewport);
        }

        // Handle orientation changes
        window.addEventListener('orientationchange', () => {
            // Force reflow after orientation change
            setTimeout(() => {
                window.scrollTo(0, 0);
            }, 100);
        });

        // Prevent pull-to-refresh on Chrome mobile
        let preventPullToRefresh = false;
        let lastY = 0;

        document.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                lastY = e.touches[0].clientY;
                preventPullToRefresh = window.pageYOffset === 0;
            }
        });

        document.addEventListener('touchmove', (e) => {
            const y = e.touches[0].clientY;
            const dy = y - lastY;

            if (preventPullToRefresh && dy > 0 && window.pageYOffset === 0) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobile);
    } else {
        initMobile();
    }

    // Export for global access
    window.MobileUtils = {
        MobileDetect,
        SwipeHandler,
        CharacterSelectionMobile,
        MobileNavigation,
        TouchFeedback
    };

})();