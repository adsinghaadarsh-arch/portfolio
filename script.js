// ==========================================
// LIGHT & DARK THEME TOGGLE WITH CIRCULAR RIPPLE TRANSITION
// ==========================================
const body = document.body;
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = themeToggleBtn.querySelector('i');

// Check Local Storage for Theme Preference
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

// Toggle Theme on Button Click with ripple transition animation
themeToggleBtn.addEventListener('click', (e) => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Create ripple overlay element centered on click event
    const ripple = document.createElement('div');
    ripple.className = 'theme-ripple';
    
    // Set colors matching target theme background
    const targetBg = newTheme === 'dark' ? '#070a13' : '#ffffff';
    ripple.style.backgroundColor = targetBg;
    
    // Position ripple at click location
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    
    body.appendChild(ripple);
    
    // Force CSS reflow to ensure transition starts
    ripple.offsetHeight;
    
    // Calculate target scale factor to completely cover screen
    const maxDim = Math.max(window.innerWidth, window.innerHeight);
    const targetScale = (maxDim * 2.5) / 20; // 20px is ripple initial width/height
    
    ripple.style.transition = 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)';
    ripple.style.transform = `translate(-50%, -50%) scale(${targetScale})`;
    
    // Switch themes on body mid-way through ripple scaling
    setTimeout(() => {
        applyTheme(newTheme);
    }, 400);
    
    // Clean up ripple element on transition end
    setTimeout(() => {
        ripple.remove();
    }, 850);
});

function applyTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update Icon
    if (theme === 'dark') {
        themeIcon.className = 'fa-solid fa-sun';
    } else {
        themeIcon.className = 'fa-solid fa-moon';
    }
}

// ==========================================
// MOBILE MENU TOGGLE
// ==========================================
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navMenuList = document.getElementById('nav-menu-list');
const menuIcon = mobileMenuBtn.querySelector('i');

mobileMenuBtn.addEventListener('click', () => {
    navMenuList.classList.toggle('active');
    
    // Toggle menu icon
    if (navMenuList.classList.contains('active')) {
        menuIcon.className = 'fa-solid fa-xmark';
    } else {
        menuIcon.className = 'fa-solid fa-bars';
    }
});

// Close Mobile Menu on Link Click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenuList.classList.remove('active');
        menuIcon.className = 'fa-solid fa-bars';
    });
});

// Close Mobile Menu if clicking outside
document.addEventListener('click', (e) => {
    if (!navMenuList.contains(e.target) && !mobileMenuBtn.contains(e.target) && navMenuList.classList.contains('active')) {
        navMenuList.classList.remove('active');
        menuIcon.className = 'fa-solid fa-bars';
    }
});

// ==========================================
// INTERSECTION OBSERVER FOR SCROLL REVEALS
// ==========================================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Reveal only once
        }
    });
}, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});

// ==========================================
// SKILLS PROGRESS BAR ANIMATION
// ==========================================
const skillsSection = document.getElementById('skills');
const progressBars = document.querySelectorAll('.skill-progress');

function animateSkillNumbers() {
    const percentages = document.querySelectorAll('.skill-percentage');
    percentages.forEach(span => {
        const target = parseInt(span.getAttribute('data-val'));
        let count = 0;
        const speed = target / 60; // finish in ~60 frames (1s at 60fps)
        const updateCount = () => {
            count += speed;
            if (count >= target) {
                span.textContent = `${target}%`;
            } else {
                span.textContent = `${Math.floor(count)}%`;
                requestAnimationFrame(updateCount);
            }
        };
        requestAnimationFrame(updateCount);
    });
}

const skillsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            progressBars.forEach(bar => {
                const targetWidth = bar.getAttribute('data-width');
                bar.style.width = targetWidth;
            });
            animateSkillNumbers();
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

if (skillsSection) {
    skillsObserver.observe(skillsSection);
}

// ==========================================
// CONTACT FORM SIMULATION
// ==========================================
const contactForm = document.getElementById('portfolio-contact-form');
const submitBtn = document.getElementById('form-submit-btn');
const statusBox = document.getElementById('contact-status-box');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Visual feedback during submit
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending Message <i class="fa-solid fa-spinner fa-spin"></i>';
        
        // Hide previous alerts
        statusBox.className = 'form-status';
        statusBox.style.display = 'none';
        
        // Simulate response time
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            
            // Show Success Notification
            statusBox.className = 'form-status success';
            statusBox.innerHTML = '<i class="fa-solid fa-circle-check"></i> Thank you! Your message has been sent successfully. Aadarsh will get back to you shortly.';
            statusBox.style.display = 'block';
            
            // Reset Form Fields
            contactForm.reset();
            
            // Auto hide success box after 5 seconds
            setTimeout(() => {
                statusBox.style.display = 'none';
            }, 6000);
            
        }, 1500);
    });
}

// ==========================================
// DYNAMIC TYPEWRITER EFFECT
// ==========================================
const typewriterTextElement = document.getElementById('typewriter-text');
const phrases = ["ACCA Aspirant", "Finance & Auditing", "Excel Modeling", "Business Analysis"];
let phraseIndex = 0;
let characterIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typePhrase() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        // Remove character
        typewriterTextElement.textContent = currentPhrase.substring(0, characterIndex - 1);
        characterIndex--;
        typingSpeed = 50; // Deleting is faster
    } else {
        // Add character
        typewriterTextElement.textContent = currentPhrase.substring(0, characterIndex + 1);
        characterIndex++;
        typingSpeed = 120; // Normal typing speed
    }

    // Handle Phrase Completed & Transitions
    if (!isDeleting && characterIndex === currentPhrase.length) {
        typingSpeed = 2000; // Pause at end of phrase
        isDeleting = true;
    } else if (isDeleting && characterIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500; // Pause before starting next phrase
    }

    setTimeout(typePhrase, typingSpeed);
}

// Start typewriter effect after preloader finishes
function startTypewriter() {
    if (typewriterTextElement) {
        setTimeout(typePhrase, 3000); // 3s delay to sync with preloader slide-out
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startTypewriter);
} else {
    startTypewriter();
}

// ==========================================
// ADVANCED 3D PARALLAX TILT EFFECT
// ==========================================
const tiltElements = document.querySelectorAll('[data-3d-hover]');

tiltElements.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position inside element
        const y = e.clientY - rect.top;  // y position inside element
        
        // Compute relative positions (-0.5 to 0.5)
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        const dx = (x - xc) / xc;
        const dy = (y - yc) / yc;
        
        // Calculate tilt rotations (max 10 degrees)
        const tiltX = -(dy * 10).toFixed(2);
        const tiltY = (dx * 10).toFixed(2);
        
        // Apply tilt transform on the card itself
        card.style.transform = `perspective(1000px) translateY(-8px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'none'; // Disable transition during mouse move for responsiveness
        
        // Dynamic Shadow displacement based on mouse offset (simulates dynamic lighting)
        const maxShadow = 22; // max shadow displacement in px
        const shadowX = -(dx * maxShadow).toFixed(2);
        const shadowY = -(dy * maxShadow).toFixed(2);
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        const shadowColor = isDark ? 'rgba(0, 0, 0, 0.55)' : 'rgba(15, 23, 42, 0.08)';
        card.style.boxShadow = `${shadowX}px ${shadowY}px 32px ${shadowColor}`;
        
        // Offset elements with data-3d-depth within the card
        const depthElements = card.querySelectorAll('[data-3d-depth]');
        depthElements.forEach(el => {
            const depth = parseFloat(el.getAttribute('data-3d-depth')) || 0;
            // Scale horizontal/vertical offset translation based on depth
            const shiftX = (dx * (depth * 0.18)).toFixed(2);
            const shiftY = (dy * (depth * 0.18)).toFixed(2);
            el.style.transform = `translate3d(${shiftX}px, ${shiftY}px, ${depth}px)`;
            el.style.transition = 'none';
        });
    });

    card.addEventListener('mouseleave', () => {
        // Reset card style smoothly
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.8s ease';
        
        // Reset depth elements inside card
        const depthElements = card.querySelectorAll('[data-3d-depth]');
        depthElements.forEach(el => {
            el.style.transform = '';
            el.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        });
    });
});

// ==========================================
// 3D CERTIFICATE LIGHTBOX MODAL LOGIC
// ==========================================
const certModal = document.getElementById('cert-modal');
const modalImg = document.getElementById('modal-image');
const modalCaption = document.getElementById('modal-caption');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalOverlay = certModal ? certModal.querySelector('.modal-overlay') : null;
const modalContainer3D = document.getElementById('modal-card-3d');

// Open Lightbox
document.querySelectorAll('.cert-card[data-cert-img]').forEach(card => {
    card.addEventListener('click', (e) => {
        // Prevent click if clicking direct link or other buttons
        if (e.target.closest('a') || e.target.closest('button')) return;
        
        const imgUrl = card.getAttribute('data-cert-img');
        const title = card.querySelector('.cert-title')?.textContent || 'Certificate';
        
        if (certModal && modalImg && modalCaption) {
            modalImg.src = imgUrl;
            modalCaption.textContent = title;
            certModal.style.display = 'flex';
            
            // Force redraw/reflow for CSS transition to fire
            certModal.offsetHeight;
            
            certModal.classList.add('active');
            certModal.setAttribute('aria-hidden', 'false');
            
            // Disable scroll
            document.body.style.overflow = 'hidden';
        }
    });
});

// Close Lightbox function
function closeCertModal() {
    if (!certModal) return;
    certModal.classList.remove('active');
    certModal.setAttribute('aria-hidden', 'true');
    
    // Enable scroll
    document.body.style.overflow = '';
    
    // Delay hiding display to allow animation to complete
    setTimeout(() => {
        if (!certModal.classList.contains('active')) {
            certModal.style.display = 'none';
            if (modalImg) modalImg.src = '';
        }
    }, 450);
}

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeCertModal);
if (modalOverlay) modalOverlay.addEventListener('click', closeCertModal);

// Close on Escape Key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certModal && certModal.classList.contains('active')) {
        closeCertModal();
    }
});

// Modal 3D mouse track tilt (extremely immersive!)
if (modalContainer3D) {
    document.addEventListener('mousemove', (e) => {
        if (!certModal || !certModal.classList.contains('active')) return;
        
        const w = window.innerWidth;
        const h = window.innerHeight;
        
        const dx = (e.clientX - w / 2) / (w / 2); // -1 to 1
        const dy = (e.clientY - h / 2) / (h / 2); // -1 to 1
        
        const tiltX = -(dy * 10).toFixed(2);
        const tiltY = (dx * 10).toFixed(2);
        
        modalContainer3D.style.transform = `perspective(1500px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1) translateZ(0)`;
        modalContainer3D.style.transition = 'none';
    });
    
    certModal.addEventListener('mouseleave', () => {
        if (modalContainer3D) {
            modalContainer3D.style.transform = 'perspective(1500px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0)';
            modalContainer3D.style.transition = 'transform 0.6s ease';
        }
    });
}

// ==========================================
// SCROLL-TRIGGERED TIMELINE PROGRESS LINE
// ==========================================
const timeline = document.querySelector('.timeline');
const timelineProgress = document.getElementById('timeline-progress-bar');

function animateTimelineLine() {
    if (!timeline || !timelineProgress) return;
    
    const rect = timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Trigger relative to the center of the viewport
    const timelineTop = rect.top + window.scrollY;
    const scrollPos = window.scrollY + (windowHeight * 0.7); 
    
    const totalHeight = rect.height;
    const elapsed = scrollPos - timelineTop;
    
    let percentage = (elapsed / totalHeight) * 100;
    percentage = Math.min(Math.max(percentage, 0), 100);
    timelineProgress.style.height = `${percentage}%`;
}

// Attach scroll/resize listeners and execute once
window.addEventListener('scroll', animateTimelineLine);
window.addEventListener('resize', animateTimelineLine);
animateTimelineLine();

// ==========================================
// HEADER SCROLL SHRINK
// ==========================================
const header = document.querySelector('.header');

function toggleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}
window.addEventListener('scroll', toggleHeaderScroll);
toggleHeaderScroll();

// ==========================================
// SCROLL SPY ACTIVE NAV LINK HIGHLIGHT
// ==========================================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-link');

function activeNavLinkSpy() {
    let currentId = 'home';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 150)) {
            currentId = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active-nav');
        if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active-nav');
        }
    });
}
window.addEventListener('scroll', activeNavLinkSpy);
activeNavLinkSpy();

// ==========================================
// STAGGER CONTAINERS OBSERVER
// ==========================================
const staggerContainers = document.querySelectorAll('.reveal-stagger');
staggerContainers.forEach(container => {
    revealObserver.observe(container);
});

// ==========================================
// ==========================================
// CUSTOM TECH PRELOADER ANIMATION
// ==========================================
const preloader = document.getElementById('preloader');
const preloaderBar = document.getElementById('preloader-progress-bar');
const preloaderPercent = document.getElementById('preloader-percentage');
const preloaderStatusEl = document.getElementById('preloader-status-el');

const statusPhases = [
    { threshold: 0, text: "Loading Portfolio Data..." },
    { threshold: 30, text: "Securing Credentials..." },
    { threshold: 60, text: "Rendering 3D Portal..." },
    { threshold: 90, text: "Interface Ready." }
];

function updateStatusText(progress) {
    if (!preloaderStatusEl) return;
    
    let activeText = statusPhases[0].text;
    statusPhases.forEach(phase => {
        if (progress >= phase.threshold) {
            activeText = phase.text;
        }
    });
    
    if (preloaderStatusEl.textContent !== activeText) {
        preloaderStatusEl.textContent = activeText;
    }
}

function startPreloader() {
    if (!preloader || !preloaderBar || !preloaderPercent) {
        body.classList.add('loaded');
        return;
    }
    
    let progress = 0;
    const duration = 1600; // Clean 1.6 seconds loading duration
    const startTime = performance.now();
    
    function updateProgress(now) {
        const elapsed = now - startTime;
        progress = Math.min((elapsed / duration) * 100, 100);
        
        preloaderBar.style.width = `${progress}%`;
        preloaderPercent.textContent = `${Math.floor(progress).toString().padStart(2, '0')}%`;
        
        updateStatusText(progress);
        
        if (progress < 100) {
            requestAnimationFrame(updateProgress);
        } else {
            // Loading completed
            setTimeout(() => {
                preloader.classList.add('fade-out');
                
                // Set loaded state on body and start animations
                setTimeout(() => {
                    body.classList.add('loaded');
                    preloader.style.display = 'none';
                    
                    // Trigger hero scroll reveals if they are there
                    const heroReveal = document.querySelector('.hero .reveal');
                    if (heroReveal) heroReveal.classList.add('active');
                }, 1200); // matching CSS clip-path transition duration (1.2s)
            }, 300);
        }
    }
    
    requestAnimationFrame(updateProgress);
}

// Start preloader safely checking document.readyState
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startPreloader);
} else {
    startPreloader();
}

// ==========================================
// CUSTOM TECH CURSOR MOUSE TRACKING
// ==========================================
const customCursor = document.getElementById('custom-cursor-el');
const cursorLabel = document.getElementById('cursor-label-el');

if (customCursor && window.innerWidth > 768) {
    // Follow mouse coordinates
    document.addEventListener('mousemove', (e) => {
        customCursor.style.left = `${e.clientX}px`;
        customCursor.style.top = `${e.clientY}px`;
    });
    
    // Add hovered states for interactive targets
    const hoverTargets = document.querySelectorAll('a, button, input, textarea, .cert-card, .edu-card, .skills-category, .about-card, .timeline-content, .info-card');
    
    hoverTargets.forEach(target => {
        target.addEventListener('mouseenter', () => {
            customCursor.classList.add('hovered');
            
            // Customize cursor text labels based on item type
            if (target.tagName === 'A' && !target.classList.contains('btn') && !target.classList.contains('social-link')) {
                cursorLabel.textContent = 'LINK';
            } else if (target.tagName === 'BUTTON' || target.classList.contains('btn') || target.id === 'theme-toggle-btn') {
                cursorLabel.textContent = 'CLICK';
            } else if (target.classList.contains('cert-card') || target.classList.contains('about-card') || target.classList.contains('edu-card')) {
                cursorLabel.textContent = 'INFO';
            } else {
                cursorLabel.textContent = 'VIEW';
            }
        });
        
        target.addEventListener('mouseleave', () => {
            customCursor.classList.remove('hovered');
            cursorLabel.textContent = 'VIEW';
        });
    });
}




