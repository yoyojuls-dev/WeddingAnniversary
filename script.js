// ========================================
// MAIN SCRIPT - DO NOT EDIT UNLESS YOU KNOW WHAT YOU'RE DOING
// All your content changes should be in data.js
// ========================================

// ========== CARD GENERATION ==========
/**
 * Creates HTML for a single card
 * @param {Object} item - The data object containing title, date, emoji, image, description, content
 * @returns {string} HTML string for the card
 */
function createCard(item) {
    const imageHtml = item.image 
        ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" onerror="this.style.display='none'">` 
        : '';
    
    return `
        <div class="card" onclick="openModal('${escapeHtml(item.title)}', '${escapeHtml(item.date)}', '${escapeHtml(item.content)}', '${item.image ? escapeHtml(item.image) : ''}')">
            <div class="card-image">
                ${imageHtml}
                <div class="card-title-overlay">${item.title}</div>
            </div>
        </div>
    `;
}

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML.replace(/'/g, '&#39;');
}

/**
 * Initialize all cards on page load
 */
function initializeCards() {
    // Generate diary cards
    const diaryContainer = document.getElementById('diaryCards');
    if (diaryContainer) {
        diaryContainer.innerHTML = diaryEntries.map(item => createCard(item)).join('');
    }

    // Generate journey cards
    const journeyContainer = document.getElementById('journeyCards');
    if (journeyContainer) {
        journeyContainer.innerHTML = journeyMilestones.map(item => createCard(item)).join('');
    }

    // Generate memories cards
    const memoriesContainer = document.getElementById('memoriesCards');
    if (memoriesContainer) {
        memoriesContainer.innerHTML = specialMemories.map(item => createCard(item)).join('');
    }

    // Generate other pictures cards
    const othersContainer = document.getElementById('othersCards');
    if (othersContainer) {
        othersContainer.innerHTML = otherPictures.map(item => createCard(item)).join('');
    }
    
    // Initialize carousel functionality after cards are created
    setTimeout(() => {
        initCarousels();
        initTouchSwipe();
        // Initial button visibility update
        requestAnimationFrame(() => {
            updateCarouselButtons();
        });
    }, 100);
}

// ========== LOADING SCREEN ==========
/**
 * Handles the loading screen animation with curtain effect
 * Shows content for 1.5s, then curtains open from bottom to top (2.5s), then reveals main content
 */
function handleLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContent = document.getElementById('mainContent');

    // Show main content after curtain animation completes (1.5s delay + 2.5s animation = 4s)
    setTimeout(() => {
        if (mainContent) {
            mainContent.classList.add('visible');
        }
    }, 3800);
    
    // Hide loading screen after curtain fully opens
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            // Remove from DOM after animation to ensure it doesn't block
            setTimeout(() => {
                if (loadingScreen && loadingScreen.parentNode) {
                    loadingScreen.style.display = 'none';
                }
            }, 500);
        }
    }, 4200);
}

// ========== MODAL FUNCTIONS ==========
/**
 * Opens the modal with content details
 * @param {string} title - The title to display
 * @param {string} date - The date to display
 * @param {string} content - The full content to display
 * @param {string} image - The image URL to display
 */
function openModal(title, date, content, image = '') {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const modalText = document.getElementById('modalText');
    const modalHeader = document.getElementById('modalHeader');

    if (modalTitle) modalTitle.textContent = decodeHtml(title);
    if (modalDate) modalDate.textContent = decodeHtml(date);
    if (modalText) modalText.textContent = decodeHtml(content);
    
    // Add image to modal header if exists
    if (modalHeader) {
        // Clear existing content
        modalHeader.innerHTML = '';
        
        // Add new image if provided
        if (image && image !== 'undefined' && image !== '') {
            const img = document.createElement('img');
            img.src = decodeHtml(image);
            img.alt = decodeHtml(title);
            img.onerror = function() { this.style.display = 'none'; };
            modalHeader.appendChild(img);
        }
    }
    
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

/**
 * Closes the modal
 */
function closeModal() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
}

/**
 * Decodes HTML entities back to text
 * @param {string} html - HTML encoded string
 * @returns {string} Decoded text
 */
function decodeHtml(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}

/**
 * Close modal when clicking outside of it
 */
function setupModalClickOutside() {
    const modal = document.getElementById('modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'modal') {
                closeModal();
            }
        });
    }
}

/**
 * Close modal with Escape key
 */
function setupModalEscapeKey() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// ========== SMOOTH SCROLLING ==========
/**
 * Smoothly scrolls to a section
 * @param {string} sectionId - The ID of the section to scroll to
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ========== CAROUSEL FUNCTIONALITY ==========
/**
 * Scrolls a carousel container left or right
 * @param {string} containerId - The ID of the carousel container
 * @param {number} direction - -1 for left, 1 for right
 */
function scrollCarousel(containerId, direction) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Prevent multiple rapid clicks
    if (container.dataset.scrolling === 'true') return;
    
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const maxScroll = scrollWidth - clientWidth;
    
    // Check if already at the edge
    const tolerance = 5; // Small tolerance for edge detection
    if (direction < 0 && scrollLeft <= tolerance) {
        // Already at left edge
        return;
    }
    if (direction > 0 && scrollLeft >= maxScroll - tolerance) {
        // Already at right edge
        return;
    }
    
    // Mark as scrolling to prevent rapid clicks
    container.dataset.scrolling = 'true';
    
    const cardWidth = container.querySelector('.card')?.offsetWidth || 300;
    const gap = parseInt(window.getComputedStyle(container).gap) || 20;
    const scrollAmount = (cardWidth + gap) * (window.innerWidth > 768 ? 2 : 1); // Scroll 2 cards on desktop, 1 on mobile
    
    // Calculate target scroll position
    const targetScroll = Math.max(0, Math.min(maxScroll, scrollLeft + (direction * scrollAmount)));
    
    container.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
    });
    
    // Reset scrolling flag after animation
    setTimeout(() => {
        container.dataset.scrolling = 'false';
        updateCarouselButtons();
    }, 500);
}

/**
 * Initialize all carousels with scroll event listeners
 */
function initCarousels() {
    const containers = ['diaryCards', 'journeyCards', 'memoriesCards', 'othersCards'];
    
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (container) {
            // Update button visibility on scroll
            container.addEventListener('scroll', () => {
                updateCarouselButtons();
            });
            
            // Update on resize
            window.addEventListener('resize', () => {
                updateCarouselButtons();
            });
        }
    });
}

/**
 * Updates carousel navigation button visibility based on scroll position
 */
function updateCarouselButtons() {
    const containers = ['diaryCards', 'journeyCards', 'memoriesCards', 'othersCards'];
    
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const wrapper = container.closest('.carousel-wrapper');
        if (!wrapper) return;
        
        const leftBtn = wrapper.querySelector('.carousel-btn-left');
        const rightBtn = wrapper.querySelector('.carousel-btn-right');
        
        const scrollLeft = container.scrollLeft;
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
        const maxScroll = scrollWidth - clientWidth;
        
        // Use a larger tolerance to prevent edge vibration
        const tolerance = 15;
        
        // Show/hide buttons based on scroll position
        if (leftBtn) {
            const canScrollLeft = scrollLeft > tolerance;
            leftBtn.style.opacity = canScrollLeft ? '1' : '0';
            leftBtn.style.pointerEvents = canScrollLeft ? 'all' : 'none';
            leftBtn.disabled = !canScrollLeft;
        }
        
        if (rightBtn) {
            const canScrollRight = scrollLeft < maxScroll - tolerance;
            rightBtn.style.opacity = canScrollRight ? '1' : '0';
            rightBtn.style.pointerEvents = canScrollRight ? 'all' : 'none';
            rightBtn.disabled = !canScrollRight;
        }
    });
}

/**
 * Initialize touch/swipe support for mobile devices
 * Enables native horizontal scrolling and swipe gestures
 */
function initTouchSwipe() {
    const containers = ['diaryCards', 'journeyCards', 'memoriesCards', 'othersCards'];
    
    containers.forEach(containerId => {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;
        let isHorizontalScroll = false;
        let hasScrolled = false;
        
        // Enable native touch scrolling
        container.style.touchAction = 'pan-x';
        
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
            isHorizontalScroll = false;
            hasScrolled = false;
        }, { passive: true });
        
        container.addEventListener('touchmove', (e) => {
            if (hasScrolled) return;
            
            const touchMoveX = e.touches[0].clientX;
            const touchMoveY = e.touches[0].clientY;
            const deltaX = Math.abs(touchMoveX - touchStartX);
            const deltaY = Math.abs(touchMoveY - touchStartY);
            
            // Determine if this is a horizontal scroll
            if (deltaX > 10 && deltaX > deltaY) {
                isHorizontalScroll = true;
                hasScrolled = true;
            }
            
            // Update button visibility during scroll
            updateCarouselButtons();
        }, { passive: true });
        
        container.addEventListener('touchend', (e) => {
            if (!isHorizontalScroll) return;
            
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndTime = Date.now();
            const swipeDistance = touchStartX - touchEndX;
            const swipeTime = touchEndTime - touchStartTime;
            const minSwipeDistance = 30; // Reduced for better responsiveness
            const maxSwipeTime = 300; // Maximum time for a swipe gesture
            
            // Check if this was a quick swipe gesture (not just scrolling)
            const isQuickSwipe = swipeTime < maxSwipeTime && Math.abs(swipeDistance) > minSwipeDistance;
            
            if (isQuickSwipe) {
                // Quick swipe - snap to next/previous card
                const cardWidth = container.querySelector('.card')?.offsetWidth || 300;
                const gap = parseInt(window.getComputedStyle(container).gap) || 20;
                const scrollAmount = cardWidth + gap;
                
                if (swipeDistance > 0) {
                    // Swipe left - scroll right
                    container.scrollBy({
                        left: scrollAmount,
                        behavior: 'smooth'
                    });
                } else {
                    // Swipe right - scroll left
                    container.scrollBy({
                        left: -scrollAmount,
                        behavior: 'smooth'
                    });
                }
            }
            
            // Update buttons after scroll ends
            setTimeout(() => updateCarouselButtons(), 100);
        }, { passive: true });
        
        // Update buttons on scroll (for native scrolling)
        container.addEventListener('scroll', () => {
            updateCarouselButtons();
        }, { passive: true });
    });
}

// ========== INITIALIZATION ==========
/**
 * Initialize everything when the page loads
 */
window.addEventListener('load', () => {
    initializeCards();
    handleLoadingScreen();
    setupModalClickOutside();
    setupModalEscapeKey();
    createParticles();
    initInteractiveEffects();
    initCardParallax();
    initCardTiltAnimation();
});

// ========== ERROR HANDLING ==========
/**
 * Basic error handling for missing data
 */
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
});

// Check if data is loaded
if (typeof diaryEntries === 'undefined' || 
    typeof journeyMilestones === 'undefined' || 
    typeof specialMemories === 'undefined') {
    console.error('ERROR: data.js not loaded properly. Make sure data.js is included before script.js');
}

// ========== INTERACTIVE PARTICLE EFFECTS ==========
/**
 * Creates floating particles in the background
 */
function createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.id = 'particles';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
    document.body.appendChild(particleContainer);

    for (let i = 0; i < 50; i++) {
        createParticle(particleContainer);
    }
}

/**
 * Creates a single particle
 */
function createParticle(container) {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 2;
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    const startX = Math.random() * 100;
    const endX = startX + (Math.random() * 20 - 10);
    
    // Randomly choose silver or black accent
    const isBlackAccent = Math.random() > 0.7;
    const gradient = isBlackAccent 
        ? 'radial-gradient(circle, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))'
        : 'radial-gradient(circle, rgba(192, 192, 192, 0.6), rgba(224, 224, 224, 0.2))';
    
    particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background: ${gradient};
        border-radius: 50%;
        left: ${startX}%;
        bottom: -10%;
        animation: float ${duration}s linear ${delay}s infinite;
        box-shadow: 0 0 10px ${isBlackAccent ? 'rgba(0, 0, 0, 0.2)' : 'rgba(192, 192, 192, 0.4)'};
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0% {
                transform: translateY(0) translateX(0) scale(1);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-110vh) translateX(${endX - startX}vw) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    container.appendChild(particle);
}

/**
 * Mouse trail effect
 */
function initInteractiveEffects() {
    let mouseX = 0;
    let mouseY = 0;
    let trail = [];

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (Math.random() > 0.8) {
            createTrailParticle(mouseX, mouseY);
        }
    });

    // Card hover glow effect
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 15px 50px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });

        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

/**
 * Parallax effect on card images based on scroll
 */
function initCardParallax() {
    const cardImages = document.querySelectorAll('.card-image img');
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                cardImages.forEach(img => {
                    const card = img.closest('.card');
                    if (!card) return;
                    
                    const rect = card.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    
                    // Only apply effect if card is in viewport
                    if (rect.top < windowHeight && rect.bottom > 0) {
                        const scrollPercent = (windowHeight - rect.top) / (windowHeight + rect.height);
                        const translateY = (scrollPercent - 0.5) * 20; // Parallax movement
                        
                        // Add subtle pan effect
                        const translateX = Math.sin(scrollPercent * Math.PI) * 5;
                        
                        img.style.transform = `translate(${translateX}px, ${translateY}px) scale(1.05)`;
                    }
                });
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Add mouse parallax effect on cards
    document.addEventListener('mousemove', (e) => {
        cardImages.forEach(img => {
            const card = img.closest('.card');
            if (!card) return;
            
            // Only if not hovering this specific card
            if (card.matches(':hover')) return;
            
            const rect = card.getBoundingClientRect();
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // Calculate distance from card center
            const distanceX = (mouseX - cardCenterX) / window.innerWidth;
            const distanceY = (mouseY - cardCenterY) / window.innerHeight;
            
            // Subtle movement based on mouse position
            const moveX = distanceX * 5;
            const moveY = distanceY * 5;
            
            img.style.transition = 'transform 0.3s ease-out';
            img.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
        });
    });
}

/**
 * Subtle tilt animation on cards when in view
 */
function initCardTiltAnimation() {
    const cards = document.querySelectorAll('.card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered animation delay
                setTimeout(() => {
                    entry.target.style.animation = 'cardFloat 3s ease-in-out infinite';
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        observer.observe(card);
        
        // Netflix-style expand on hover
        let hoverTimeout;
        
        card.addEventListener('mouseenter', function() {
            hoverTimeout = setTimeout(() => {
                // Expand card
                this.style.transform = 'scale(1.08)';
                this.style.zIndex = '10';
                this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
                
                // Add extra glow
                this.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(192, 192, 192, 0.2)';
                
                // Animate image inside
                const img = this.querySelector('.card-image img');
                if (img) {
                    img.style.transform = 'scale(1.2)';
                    img.style.filter = 'brightness(1.2) contrast(1.1)';
                }
                
                // Pulse emoji
                const emoji = this.querySelector('.card-image-content');
                if (emoji) {
                    emoji.style.animation = 'emojiPulse 1s ease-in-out infinite';
                }
            }, 300); // Delay before expansion (Netflix-style)
        });
        
        card.addEventListener('mouseleave', function() {
            clearTimeout(hoverTimeout);
            this.style.transform = '';
            this.style.zIndex = '';
            this.style.boxShadow = '';
            
            const img = this.querySelector('.card-image img');
            if (img) {
                img.style.transform = '';
                img.style.filter = '';
            }
            
            const emoji = this.querySelector('.card-image-content');
            if (emoji) {
                emoji.style.animation = '';
            }
        });
    });
    
    // Add floating animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes cardFloat {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-8px);
            }
        }
        
        @keyframes emojiPulse {
            0%, 100% {
                transform: scale(1.1);
            }
            50% {
                transform: scale(1.3);
            }
        }
        
        .card {
            will-change: transform;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Creates a trail particle at mouse position
 */
function createTrailParticle(x, y) {
    const particle = document.createElement('div');
    
    // Randomly choose silver or black accent
    const isBlackAccent = Math.random() > 0.6;
    const gradient = isBlackAccent 
        ? 'radial-gradient(circle, rgba(0, 0, 0, 0.4), transparent)'
        : 'radial-gradient(circle, rgba(192, 192, 192, 0.6), transparent)';
    
    particle.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 8px;
        height: 8px;
        background: ${gradient};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        animation: trailFade 1s ease-out forwards;
    `;

    const style = document.createElement('style');
    style.textContent = `
        @keyframes trailFade {
            0% {
                transform: scale(1);
                opacity: 1;
            }
            100% {
                transform: scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    document.body.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 1000);
}