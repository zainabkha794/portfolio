// DOM elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contactForm');
const skillProgressBars = document.querySelectorAll('.skill-progress');

// Navigation functionality
let isMenuOpen = false;

// Toggle mobile menu
hamburger.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
});

// Close menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (isMenuOpen) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
            isMenuOpen = false;
        }
    });
});

// Navbar scroll effect
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    // Add scrolled class for styling
    if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar on scroll
    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollY = currentScrollY;
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');

const highlightNavigation = () => {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
};

window.addEventListener('scroll', highlightNavigation);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // Animate skill progress bars
            if (entry.target.classList.contains('skills')) {
                animateSkillBars();
            }
            
            // Animate counters if they exist
            if (entry.target.classList.contains('stats')) {
                animateCounters();
            }
        }
    });
}, observerOptions);

// Observe sections for animations
sections.forEach(section => {
    observer.observe(section);
});

// Skill bars animation
const animateSkillBars = () => {
    skillProgressBars.forEach((bar, index) => {
        const width = bar.getAttribute('data-width');
        
        setTimeout(() => {
            bar.style.width = width + '%';
        }, index * 200);
    });
};

// Contact form handling
class ContactFormHandler {
    constructor(form) {
        this.form = form;
        this.submitBtn = form.querySelector('.submit-btn');
        this.btnText = this.submitBtn.querySelector('.btn-text');
        this.btnLoader = this.submitBtn.querySelector('.btn-loader');
        
        this.initializeForm();
    }
    
    initializeForm() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateForm()) {
            return;
        }
        
        this.setLoading(true);
        
        try {
            // Simulate form submission
            await this.submitForm();
            this.showSuccess();
            this.form.reset();
        } catch (error) {
            this.showError('Something went wrong. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }
    
    async submitForm() {
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // In a real application, you would send the form data to your server
                const formData = new FormData(this.form);
                const data = Object.fromEntries(formData);
                
                console.log('Form submitted with data:', data);
                
                // Simulate success (you can change this to test error handling)
                const success = Math.random() > 0.1;
                
                if (success) {
                    resolve(data);
                } else {
                    reject(new Error('Submission failed'));
                }
            }, 2000);
        });
    }
    
    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (!value) {
            errorMessage = `${this.getFieldLabel(fieldName)} is required.`;
            isValid = false;
        } else {
            // Specific field validations
            switch (fieldName) {
                case 'email':
                    if (!this.isValidEmail(value)) {
                        errorMessage = 'Please enter a valid email address.';
                        isValid = false;
                    }
                    break;
                case 'name':
                    if (value.length < 2) {
                        errorMessage = 'Name must be at least 2 characters long.';
                        isValid = false;
                    }
                    break;
                case 'subject':
                    if (value.length < 5) {
                        errorMessage = 'Subject must be at least 5 characters long.';
                        isValid = false;
                    }
                    break;
                case 'message':
                    if (value.length < 10) {
                        errorMessage = 'Message must be at least 10 characters long.';
                        isValid = false;
                    }
                    break;
            }
        }
        
        this.showFieldError(fieldName, errorMessage);
        return isValid;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    getFieldLabel(fieldName) {
        const labels = {
            name: 'Name',
            email: 'Email',
            subject: 'Subject',
            message: 'Message'
        };
        return labels[fieldName] || fieldName;
    }
    
    showFieldError(fieldName, message) {
        const errorElement = document.getElementById(`${fieldName}Error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.toggle('show', !!message);
        }
    }
    
    clearError(field) {
        this.showFieldError(field.name, '');
    }
    
    setLoading(loading) {
        this.submitBtn.disabled = loading;
        this.submitBtn.classList.toggle('loading', loading);
    }
    
    showSuccess() {
        this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
    }
    
    showError(message) {
        this.showNotification(message, 'error');
    }
    
    showNotification(message, type) {
        const notification = this.createNotification(message, type);
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
    
    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add notification styles
        const styles = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: 10px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                border-left: 4px solid;
                max-width: 400px;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
                z-index: 10000;
            }
            
            .notification.show {
                opacity: 1;
                transform: translateX(0);
            }
            
            .notification-success {
                border-left-color: #10b981;
            }
            
            .notification-error {
                border-left-color: #ef4444;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px 20px;
            }
            
            .notification-content i:first-child {
                font-size: 1.2rem;
            }
            
            .notification-success .notification-content i:first-child {
                color: #10b981;
            }
            
            .notification-error .notification-content i:first-child {
                color: #ef4444;
            }
            
            .notification-content span {
                flex: 1;
                color: #374151;
                font-weight: 500;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: #9ca3af;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: all 0.2s ease;
            }
            
            .notification-close:hover {
                background: #f3f4f6;
                color: #6b7280;
            }
        `;
        
        // Add styles to head if not already added
        if (!document.querySelector('#notification-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'notification-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
        
        // Add close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        });
        
        return notification;
    }
}

// Initialize contact form
if (contactForm) {
    new ContactFormHandler(contactForm);
}

// Floating animation for hero elements
const floatingElements = document.querySelectorAll('.floating-icon');
floatingElements.forEach((element, index) => {
    const delay = element.getAttribute('data-delay') || 0;
    element.style.animationDelay = `${delay}s`;
});

// Parallax effect for hero background
const heroSection = document.querySelector('.hero');
const bgShapes = document.querySelectorAll('.bg-shape');

if (heroSection) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = heroSection.offsetHeight;
        const scrollProgress = Math.min(scrolled / heroHeight, 1);
        
        bgShapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.1;
            const yPos = scrolled * speed;
            shape.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Scroll indicator functionality
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Dynamic typing effect for hero title (optional enhancement)
class TypingEffect {
    constructor(element, texts, options = {}) {
        this.element = element;
        this.texts = texts;
        this.speed = options.speed || 100;
        this.deleteSpeed = options.deleteSpeed || 50;
        this.pauseTime = options.pauseTime || 2000;
        this.currentIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        
        this.start();
    }
    
    start() {
        this.type();
    }
    
    type() {
        const fullText = this.texts[this.currentIndex];
        
        if (this.isDeleting) {
            this.currentText = fullText.substring(0, this.currentText.length - 1);
        } else {
            this.currentText = fullText.substring(0, this.currentText.length + 1);
        }
        
        this.element.textContent = this.currentText;
        
        let typeSpeed = this.isDeleting ? this.deleteSpeed : this.speed;
        
        if (!this.isDeleting && this.currentText === fullText) {
            typeSpeed = this.pauseTime;
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentText === '') {
            this.isDeleting = false;
            this.currentIndex = (this.currentIndex + 1) % this.texts.length;
            typeSpeed = 500;
        }
        
        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialize typing effect for role (optional)
const roleElement = document.querySelector('.role');
if (roleElement && window.innerWidth > 768) {
    // Only enable on desktop to avoid performance issues
    new TypingEffect(roleElement, [
        'Frontend Developer',
        'Web Designer',
        'UI/UX Enthusiast',
        'Problem Solver'
    ]);
}

// Performance optimization: Lazy loading for images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape' && isMenuOpen) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
        isMenuOpen = false;
    }
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');
    
    // Trigger initial scroll event for navigation highlighting
    highlightNavigation();
    
    // Initialize skill bars animation if skills section is in viewport
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(animateSkillBars, 500);
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        skillsObserver.observe(skillsSection);
    }
});

// Error handling for missing elements
const handleMissingElements = () => {
    const requiredElements = [
        { selector: '#navbar', name: 'Navigation bar' },
        { selector: '#hamburger', name: 'Hamburger menu' },
        { selector: '#nav-menu', name: 'Navigation menu' },
        { selector: '#contactForm', name: 'Contact form' }
    ];
    
    requiredElements.forEach(({ selector, name }) => {
        if (!document.querySelector(selector)) {
            console.warn(`${name} element not found: ${selector}`);
        }
    });
};

// Call error handling
handleMissingElements();

// Expose useful functions globally for debugging
window.portfolioDebug = {
    animateSkillBars,
    highlightNavigation,
    ContactFormHandler
};
