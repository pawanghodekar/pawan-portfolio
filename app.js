/**
 * PAWAN GHODEKAR - PORTFOLIO INTERACTION ENGINE
 * Built with vanilla ES6+ JavaScript. Performance & Animation driven.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. DYNAMIC THEME SYSTEM (Dark / Light mode controller)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Load saved preference or fallback to system dark preferences
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        htmlElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Transition smooth effects handled by CSS rules
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // ==========================================================================
    // 2. MOBILE NAVIGATION DRAWER
    // ==========================================================================
    const menuToggle = document.querySelector('.menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileBackdrop = document.querySelector('.mobile-menu-backdrop');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    const toggleDrawer = (open = true) => {
        mobileMenu.classList.toggle('active', open);
        mobileBackdrop.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', () => toggleDrawer(true));
    closeMenu.addEventListener('click', () => toggleDrawer(false));
    mobileBackdrop.addEventListener('click', () => toggleDrawer(false));
    
    // Close drawer upon selecting links
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => toggleDrawer(false));
    });

    // ==========================================================================
    // 3. TYPEWRITER ROLE ANIMATION (Hero section Loop)
    // ==========================================================================
    const roleTextContainer = document.querySelector('.role-text');
    const roles = [
        "Information Technology Engineer",
        "Google Cloud & DevOps Enthusiast",
        "Data Science & Machine Learning Practitioner",
        "Freelance Software Engineer"
    ];
    
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const runTypewriter = () => {
        const currentRole = roles[roleIdx];
        
        if (isDeleting) {
            // Remove character
            roleTextContainer.textContent = currentRole.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 50; // Deletes quicker
        } else {
            // Add character
            roleTextContainer.textContent = currentRole.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 100;
        }

        // State changes
        if (!isDeleting && charIdx === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at full word
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(runTypewriter, typingSpeed);
    };

    if (roleTextContainer) {
        setTimeout(runTypewriter, 1000);
    }

    // ==========================================================================
    // 4. ACTIVE NAVIGATION LINK ON SCROLL (Scroll Spy)
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const updateActiveNav = () => {
        let currentSectionId = '';
        
        // Find visible section ID
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // offset navigation height
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        // Set active class
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', updateActiveNav);

    // ==========================================================================
    // 5. INTERSECT OBSERVER FOR STATS & SKILL PROGRESS BARS
    // ==========================================================================
    
    // Increment Stats numbers
    const statsSection = document.querySelector('.stats-counter');
    const statNumbers = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    const animateCounters = () => {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            let current = 0;
            const increment = target / 50; // speed duration mapping
            
            const updateCount = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.ceil(current);
                    setTimeout(updateCount, 25);
                } else {
                    stat.textContent = target;
                }
            };
            
            updateCount();
        });
        animatedStats = true;
    };

    // Load progress bars dynamically
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    
    const animateSkills = () => {
        skillProgressBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        });
    };

    // Combined Intersection Observer for optimization
    const globalObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target === statsSection && !animatedStats) {
                    animateCounters();
                }
                if (entry.target.classList.contains('skills-section')) {
                    animateSkills();
                }
            }
        });
    }, { threshold: 0.15 });

    if (statsSection) globalObserver.observe(statsSection);
    
    const skillsSection = document.querySelector('.skills-section');
    if (skillsSection) globalObserver.observe(skillsSection);

    // ==========================================================================
    // 6. TECHNICAL SKILLS CATEGORY FILTERING TABS
    // ==========================================================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const skillCards = document.querySelectorAll('.skill-card');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Set active status
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            skillCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Animate showing/hiding
                if (category === 'all' || cardCategory === category) {
                    card.classList.remove('hide');
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                        // Reload bar animation
                        const bar = card.querySelector('.skill-progress');
                        bar.style.width = bar.getAttribute('data-width');
                    }, 50);
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // ==========================================================================
    // 7. CONTACT FORM SUBMISSION HANDLER (Mock Integration)
    // ==========================================================================
    const contactForm = document.getElementById('portfolio-contact-form');
    const formStatusModal = document.getElementById('form-status');
    const closeStatusBtn = document.getElementById('close-status-btn');
    const submitBtn = contactForm.querySelector('.btn-submit');
    const submitBtnText = submitBtn.querySelector('.btn-text');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. Disable controls
        submitBtn.disabled = true;
        submitBtnText.textContent = "Sending...";
        
        // Form field data gathering
        const formData = {
            name: document.getElementById('contact-name').value,
            email: document.getElementById('contact-email').value,
            subject: document.getElementById('contact-subject').value,
            message: document.getElementById('contact-message').value,
        };

        // 2. Simulate asynchronous network delivery
        setTimeout(() => {
            // Restore button state
            submitBtn.disabled = false;
            submitBtnText.textContent = "Send Message";

            // Trigger premium success dialog view
            formStatusModal.classList.add('active');
            
            // Reset form
            contactForm.reset();
        }, 1500);
    });

    // Close success overlay window
    closeStatusBtn.addEventListener('click', () => {
        formStatusModal.classList.remove('active');
    });
});
