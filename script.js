// =============================
// SMOOTH SCROLL
// =============================
function scrollTo(id) {
    const element = document.getElementById(id);
    if (element) {
        const offset = 80; // navbar height
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
}

// =============================
// NAVBAR SCROLL EFFECT
// =============================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add shadow when scrolled
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// =============================
// MOBILE MENU
// =============================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// =============================
// FAQ ACCORDION
// =============================
function toggleFaq(button) {
    const item = button.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all FAQs
    document.querySelectorAll('.faq-item').forEach(el => {
        el.classList.remove('open');
    });

    // Open this one if it wasn't open
    if (!isOpen) {
        item.classList.add('open');
    }
}

// =============================
// FORM VALIDATION & SUBMISSION
// =============================
function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');

    // Get all form inputs
    const inputs = form.querySelectorAll('input:not([type="checkbox"]), select, textarea');
    let isValid = true;

    // Clear previous errors
    inputs.forEach(input => {
        input.style.borderColor = '';
    });

    // Clear platform box errors
    document.querySelectorAll('.platform-box').forEach(box => {
        box.style.borderColor = '';
    });

    // Validate each field
    inputs.forEach(input => {
        if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#ff6b6b';

            // Add shake animation
            input.style.animation = 'shake 0.5s';
            setTimeout(() => {
                input.style.animation = '';
            }, 500);
        }

        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                isValid = false;
                input.style.borderColor = '#ff6b6b';
            }
        }
    });

    // Validate platform checkboxes - at least one must be selected
    const platformCheckboxes = form.querySelectorAll('input[name="platforms"]');
    const platformSelected = Array.from(platformCheckboxes).some(cb => cb.checked);

    if (!platformSelected) {
        isValid = false;
        // Highlight all platform boxes in red
        document.querySelectorAll('.platform-box').forEach(box => {
            box.style.borderColor = '#ff6b6b';
            box.style.animation = 'shake 0.5s';
            setTimeout(() => {
                box.style.animation = '';
            }, 500);
        });
        showNotification('Please select at least one platform', 'error');
    }

    if (!isValid) {
        if (platformSelected) {
            showNotification('Please fill in all required fields correctly', 'error');
        }
        return;
    }

    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';

    // Get form data
    const formData = new FormData(form);

    // Collect all selected platforms
    const platforms = [];
    platformCheckboxes.forEach(cb => {
        if (cb.checked) {
            platforms.push(cb.value);
        }
    });

    // Convert to object and add platforms array
    const data = {};
    for (let [key, value] of formData.entries()) {
        if (key !== 'platforms') {
            data[key] = value;
        }
    }
    data.platforms = platforms;

    // Simulate submission (replace with actual API call)
    setTimeout(() => {
        console.log('Form submitted:', data);

        // Show success message
        showNotification('Thank you! We\'ll contact you within 24 hours.', 'success');

        // Reset form
        form.reset();

        // Reset button
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;

        // Track conversion (if analytics installed)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submission', {
                'event_category': 'lead',
                'event_label': 'consultation_request'
            });
        }
    }, 1500);
}

// =============================
// NOTIFICATION SYSTEM
// =============================
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; padding: 0 0 0 1rem; font-size: 1.2rem;">&times;</button>
    `;

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '12px',
        backgroundColor: type === 'success' ? '#8BC5A8' : '#ff6b6b',
        color: 'white',
        fontWeight: '600',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        animation: 'slideInRight 0.3s ease-out',
        maxWidth: 'calc(100vw - 40px)'
    });

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(notificationStyles);

// =============================
// STATS COUNTER ANIMATION
// =============================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

function formatNumber(num) {
    if (num >= 1000000) {
        const millions = num / 1000000;
        // Only show decimal if it's not a whole number
        return (millions % 1 === 0 ? millions : millions.toFixed(1)) + 'M';
    } else if (num >= 1000) {
        const thousands = num / 1000;
        // Only show decimal if it's not a whole number
        return (thousands % 1 === 0 ? thousands : thousands.toFixed(1)) + 'K';
    }
    return Math.round(num);
}

function formatWithPrefix(num, prefix, suffix) {
    const formatted = formatNumber(num);
    return `${prefix}${formatted}${suffix}`;
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            const text = entry.target.textContent.trim();

            // Store original prefix/suffix
            const prefix = text.startsWith('$') ? '$' : (text.startsWith('+') ? '+' : '');
            const suffix = text.includes('%') ? '%' : '';

            // Extract number from text
            const numberMatch = text.match(/[\d.]+/);
            if (numberMatch) {
                const number = parseFloat(numberMatch[0]);
                let targetValue = number;

                // Convert to actual number based on suffix
                if (text.includes('M')) {
                    targetValue = number * 1000000;
                } else if (text.includes('K')) {
                    targetValue = number * 1000;
                } else if (text.includes('%')) {
                    targetValue = number;
                }

                // Store format info
                entry.target.dataset.prefix = prefix;
                entry.target.dataset.suffix = suffix;
                entry.target.dataset.hasM = text.includes('M+') ? 'true' : 'false';
                entry.target.dataset.hasK = text.includes('K') ? 'true' : 'false';

                entry.target.textContent = prefix + '0' + suffix;
                animateCounterWithFormat(entry.target, targetValue, prefix, suffix);
            }

            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

function animateCounterWithFormat(element, target, prefix, suffix) {
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = prefix + formatNumber(target) + suffix;
            clearInterval(timer);
        } else {
            element.textContent = prefix + formatNumber(Math.floor(current)) + suffix;
        }
    }, 16);
}

// Observe stat values
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.stat-value, .proof-number, .stat-number, .quick-result-stat').forEach(stat => {
        statsObserver.observe(stat);
    });
});

// =============================
// FORM INPUT ENHANCEMENTS
// =============================
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        // Add floating label effect
        input.addEventListener('focus', () => {
            input.parentElement?.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement?.classList.remove('focused');
            }
        });

        // Real-time validation feedback
        input.addEventListener('input', () => {
            if (input.hasAttribute('required') && input.value.trim()) {
                input.style.borderColor = '#8BC5A8';
            }
        });
    });
});

// =============================
// PRICING CARD INTERACTIONS
// =============================
document.addEventListener('DOMContentLoaded', () => {
    const pricingCards = document.querySelectorAll('.pricing-card');

    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            pricingCards.forEach(c => {
                if (c !== card) {
                    c.style.opacity = '0.7';
                }
            });
        });

        card.addEventListener('mouseleave', () => {
            pricingCards.forEach(c => {
                c.style.opacity = '1';
            });
        });
    });
});

// =============================
// CURSOR TRAIL EFFECT (OPTIONAL)
// =============================
let cursorTrail = [];
const maxTrailLength = 10;

document.addEventListener('mousemove', (e) => {
    // Only on larger screens
    if (window.innerWidth < 768) return;

    // Limit to hero section for performance
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const rect = hero.getBoundingClientRect();
    if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
        cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });

        if (cursorTrail.length > maxTrailLength) {
            cursorTrail.shift();
        }
    }
});

// =============================
// PERFORMANCE OPTIMIZATION
// =============================
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy load images when they come into view
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
});

// =============================
// ACCESSIBILITY ENHANCEMENTS
// =============================
document.addEventListener('DOMContentLoaded', () => {
    // Add keyboard navigation for FAQ
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFaq(button);
            }
        });
    });

    // Add focus visible styles
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-nav');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-nav');
    });
});

// =============================
// ANALYTICS & TRACKING
// =============================
function trackEvent(category, action, label) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }

    console.log(`Track: ${category} - ${action} - ${label}`);
}

// Track button clicks
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const label = btn.textContent.trim();
            trackEvent('engagement', 'button_click', label);
        });
    });

    // Track scroll depth
    let maxScroll = 0;
    const trackScrollDepth = debounce(() => {
        const scrollPercent = Math.round(
            (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
        );

        if (scrollPercent > maxScroll && scrollPercent % 25 === 0) {
            maxScroll = scrollPercent;
            trackEvent('engagement', 'scroll_depth', `${scrollPercent}%`);
        }
    }, 500);

    window.addEventListener('scroll', trackScrollDepth);
});

// =============================
// LANGUAGE SWITCHING
// =============================
const translations = {
    en: {
        nav: {
            education: 'Education',
            results: 'Results',
            system: 'Our System',
            stories: 'Stories',
            apply: 'Apply'
        },
        hero: {
            badge: '🔥 Trusted by 360+ Top Female Creators',
            title: 'Turn Your Content Into a<br><span class="highlight">7-Figure Business</span>',
            subtitle: 'We handle everything—DMs, strategy, growth, monetization—so you can focus on creating while earning <strong>6-7 figures.</strong>',
            stats: {
                revenue: '$50M+',
                revenueLabel: 'Generated for Creators',
                reach: '350M+',
                reachLabel: 'Total Reach'
            },
            cta: 'Get Your Free Strategy Session',
            ctaNote: '💬 Free consultation • No commitment • See your custom roadmap in 24 hours',
            socialProof: '<strong>97% success rate</strong> • Join creators earning $10K-$150K/month'
        },
        form: {
            title: 'Ready to Scale?',
            subtitle: 'Apply for your free 30-minute strategy consultation. We\'ll show you exactly how to get to 6-figures.',
            name: 'Your Name',
            email: 'Email',
            instagram: 'Instagram Username',
            phone: 'Phone Number',
            platforms: 'Select Your Platforms (choose all that apply) *',
            income: 'Current Monthly Income ($)',
            challenge: 'Tell us your biggest challenge...',
            submit: 'Schedule Free Consultation',
            note: 'We\'ll contact you within 24 hours with your personalized strategy.'
        },
        faq: {
            title: 'Still Have Questions?',
            subtitle: 'Everything you need to know before taking the next step',
            q1: '💰 How much does it really cost to work with ScaleHer?',
            a1: 'We offer tailored packages based on where you are in your journey. Whether you\'re just starting or already earning 6-figures, we have a plan that fits. <strong>The real question isn\'t the cost—it\'s the ROI.</strong> Our average creator sees a 300% revenue increase within 6 months. Book a free consultation and we\'ll create a custom plan for your goals.',
            q2: '⏱️ How quickly will I see real results?',
            a2: '<strong>Most creators see 20-40% growth within the first 30 days.</strong> Significant income changes typically happen within 60-90 days. We\'ve had creators hit $10K/month within 8 weeks of starting. Your results depend on your starting point, niche, and commitment to following our proven system. The consultation will give you a realistic timeline for your specific situation.',
            q3: '🔒 Is my account and personal information safe?',
            a3: 'Absolutely. <strong>You maintain full control and ownership of all your accounts.</strong> We use industry-standard security protocols and encrypted systems. You can revoke access instantly at any time. We\'ve managed 360+ creators with zero security incidents. Complete transparency and trust are non-negotiable for us.',
            q4: '📝 Am I locked into a long-term contract?',
            a4: 'No long-term contracts or commitments. We recommend 3 months to properly implement our system and see real results, but you\'re free to cancel anytime. <strong>97% of our creators stay 12+ months</strong> because they\'re seeing consistent growth. We earn your loyalty through results, not restrictive contracts.',
            q5: '🚀 What if I\'m brand new with no followers?',
            a5: '<strong>Even better!</strong> Starting fresh means no bad habits to unlearn. We\'ve helped dozens of creators go from 0 to 6-figures. You don\'t need an existing following—you need the right strategy, consistency, and expert guidance. We provide all three. Bring your authenticity and willingness to learn; we\'ll handle the rest.',
            q6: '🤔 What makes ScaleHer different from other agencies?',
            a6: 'Three things: <strong>(1) Proven Results</strong> - $50M+ generated for our creators. <strong>(2) Female-First Approach</strong> - We understand the unique challenges female creators face and build strategies around them. <strong>(3) Full-Service Management</strong> - From content strategy to DM management to revenue optimization, we handle everything so you can focus on creating. Other agencies offer pieces. We offer the complete solution.',
            ctaTitle: 'Still not sure? Let\'s talk.',
            ctaSubtitle: 'Book a free 30-minute consultation. No pressure, no obligations. Just honest answers about whether ScaleHer is right for you.',
            ctaButton: 'Schedule Your Free Consultation',
            ctaNote: '💬 <strong>Average response time: 4 hours</strong> • ✓ No credit card required'
        },
        buttons: {
            learnMore: 'Learn More',
            getStarted: 'Get Started',
            apply: 'Apply',
            exploreResources: 'Explore Free Resources',
            viewGuides: 'View Free Guides',
            scheduleFree: 'Schedule Your Free Consultation',
            startConsultation: 'Start Your Free Consultation Now',
            scheduleConsultation: 'Schedule Free Consultation'
        }
    },
    es: {
        nav: {
            education: 'Educación',
            results: 'Resultados',
            system: 'Nuestro Sistema',
            stories: 'Historias',
            apply: 'Aplicar'
        },
        hero: {
            badge: '🔥 Confiado por más de 360 Creadoras Top',
            title: 'Convierte Tu Contenido en un<br><span class="highlight">Negocio de 7 Cifras</span>',
            subtitle: 'Nos encargamos de todo—DMs, estrategia, crecimiento, monetización—para que te enfoques en crear mientras ganas <strong>6-7 cifras.</strong>',
            stats: {
                revenue: '$50M+',
                revenueLabel: 'Generado para Creadoras',
                reach: '350M+',
                reachLabel: 'Alcance Total'
            },
            cta: 'Obtén Tu Sesión Estratégica Gratis',
            ctaNote: '💬 Consulta gratuita • Sin compromiso • Ve tu hoja de ruta personalizada en 24 horas',
            socialProof: '<strong>97% de tasa de éxito</strong> • Únete a creadoras ganando $10K-$150K/mes'
        },
        form: {
            title: '¿Lista para Escalar?',
            subtitle: 'Solicita tu consulta estratégica gratuita de 30 minutos. Te mostraremos exactamente cómo llegar a las 6 cifras.',
            name: 'Tu Nombre',
            email: 'Correo Electrónico',
            instagram: 'Usuario de Instagram',
            phone: 'Número de Teléfono',
            platforms: 'Selecciona Tus Plataformas (elige todas las que apliquen) *',
            income: 'Ingresos Mensuales Actuales ($)',
            challenge: 'Cuéntanos tu mayor desafío...',
            submit: 'Agendar Consulta Gratuita',
            note: 'Te contactaremos en 24 horas con tu estrategia personalizada.'
        },
        faq: {
            title: '¿Todavía Tienes Preguntas?',
            subtitle: 'Todo lo que necesitas saber antes de dar el siguiente paso',
            q1: '💰 ¿Cuánto cuesta realmente trabajar con ScaleHer?',
            a1: 'Ofrecemos paquetes personalizados según dónde estés en tu camino. Ya sea que estés comenzando o ya ganando 6 cifras, tenemos un plan que se ajusta. <strong>La verdadera pregunta no es el costo—es el ROI.</strong> Nuestra creadora promedio ve un aumento de ingresos del 300% en 6 meses. Reserva una consulta gratuita y crearemos un plan personalizado para tus objetivos.',
            q2: '⏱️ ¿Qué tan rápido veré resultados reales?',
            a2: '<strong>La mayoría de las creadoras ven un crecimiento del 20-40% en los primeros 30 días.</strong> Los cambios significativos de ingresos generalmente ocurren en 60-90 días. Hemos tenido creadoras que alcanzan $10K/mes en 8 semanas desde el inicio. Tus resultados dependen de tu punto de partida, nicho y compromiso con nuestro sistema probado. La consulta te dará un cronograma realista para tu situación específica.',
            q3: '🔒 ¿Mi cuenta e información personal están seguras?',
            a3: 'Absolutamente. <strong>Mantienes el control total y la propiedad de todas tus cuentas.</strong> Usamos protocolos de seguridad estándar de la industria y sistemas encriptados. Puedes revocar el acceso instantáneamente en cualquier momento. Hemos gestionado más de 360 creadoras sin incidentes de seguridad. La transparencia completa y la confianza son innegociables para nosotros.',
            q4: '📝 ¿Estoy obligada a un contrato a largo plazo?',
            a4: 'Sin contratos ni compromisos a largo plazo. Recomendamos 3 meses para implementar nuestro sistema correctamente y ver resultados reales, pero eres libre de cancelar en cualquier momento. <strong>El 97% de nuestras creadoras permanecen más de 12 meses</strong> porque están viendo un crecimiento constante. Nos ganamos tu lealtad a través de resultados, no contratos restrictivos.',
            q5: '🚀 ¿Qué pasa si soy nueva sin seguidores?',
            a5: '<strong>¡Incluso mejor!</strong> Comenzar de cero significa no tener malos hábitos que desaprender. Hemos ayudado a docenas de creadoras a pasar de 0 a 6 cifras. No necesitas seguidores existentes—necesitas la estrategia correcta, consistencia y orientación experta. Proporcionamos las tres. Trae tu autenticidad y disposición para aprender; nos encargaremos del resto.',
            q6: '🤔 ¿Qué hace a ScaleHer diferente de otras agencias?',
            a6: 'Tres cosas: <strong>(1) Resultados Probados</strong> - Más de $50M generados para nuestras creadoras. <strong>(2) Enfoque Femenino</strong> - Entendemos los desafíos únicos que enfrentan las creadoras y construimos estrategias en torno a ellos. <strong>(3) Gestión de Servicio Completo</strong> - Desde estrategia de contenido hasta gestión de DMs y optimización de ingresos, manejamos todo para que puedas enfocarte en crear. Otras agencias ofrecen piezas. Nosotros ofrecemos la solución completa.',
            ctaTitle: '¿Aún no estás segura? Hablemos.',
            ctaSubtitle: 'Reserva una consulta gratuita de 30 minutos. Sin presión, sin obligaciones. Solo respuestas honestas sobre si ScaleHer es adecuada para ti.',
            ctaButton: 'Agenda Tu Consulta Gratuita',
            ctaNote: '💬 <strong>Tiempo de respuesta promedio: 4 horas</strong> • ✓ No se requiere tarjeta de crédito'
        },
        buttons: {
            learnMore: 'Aprende Más',
            getStarted: 'Comenzar',
            apply: 'Aplicar',
            exploreResources: 'Explorar Recursos Gratis',
            viewGuides: 'Ver Guías Gratis',
            scheduleFree: 'Agenda Tu Consulta Gratuita',
            startConsultation: 'Comienza Tu Consulta Gratuita Ahora',
            scheduleConsultation: 'Agendar Consulta Gratuita'
        }
    },
    ar: {
        nav: {
            education: 'Educación',
            results: 'Resultados',
            system: 'Nuestro Sistema',
            stories: 'Historias',
            apply: 'Aplicar'
        },
        hero: {
            badge: '🔥 Confiado por más de 360 Creadoras Top',
            title: 'Convertí Tu Contenido en un<br><span class="highlight">Negocio de 7 Cifras</span>',
            subtitle: 'Nos encargamos de todo—DMs, estrategia, crecimiento, monetización—para que te enfoques en crear mientras ganás <strong>6-7 cifras.</strong>',
            stats: {
                revenue: '$50M+',
                revenueLabel: 'Generado para Creadoras',
                reach: '350M+',
                reachLabel: 'Alcance Total'
            },
            cta: 'Conseguí Tu Sesión Estratégica Gratis',
            ctaNote: '💬 Consulta gratuita • Sin compromiso • Mirá tu hoja de ruta personalizada en 24 horas',
            socialProof: '<strong>97% de tasa de éxito</strong> • Unite a creadoras ganando $10K-$150K/mes'
        },
        form: {
            title: '¿Lista para Escalar?',
            subtitle: 'Solicitá tu consulta estratégica gratuita de 30 minutos. Te mostraremos exactamente cómo llegar a las 6 cifras.',
            name: 'Tu Nombre',
            email: 'Correo Electrónico',
            instagram: 'Usuario de Instagram',
            phone: 'Número de Teléfono',
            platforms: 'Seleccioná Tus Plataformas (elegí todas las que apliquen) *',
            income: 'Ingresos Mensuales Actuales ($)',
            challenge: 'Contanos tu mayor desafío...',
            submit: 'Agendar Consulta Gratuita',
            note: 'Te contactaremos en 24 horas con tu estrategia personalizada.'
        },
        faq: {
            title: '¿Todavía Tenés Preguntas?',
            subtitle: 'Todo lo que necesitás saber antes de dar el siguiente paso',
            q1: '💰 ¿Cuánto sale realmente trabajar con ScaleHer?',
            a1: 'Ofrecemos paquetes personalizados según dónde estés en tu camino. Ya sea que estés empezando o ya ganando 6 cifras, tenemos un plan que se ajusta. <strong>La verdadera pregunta no es el costo—es el ROI.</strong> Nuestra creadora promedio ve un aumento de ingresos del 300% en 6 meses. Reservá una consulta gratuita y crearemos un plan personalizado para tus objetivos.',
            q2: '⏱️ ¿Qué tan rápido voy a ver resultados reales?',
            a2: '<strong>La mayoría de las creadoras ven un crecimiento del 20-40% en los primeros 30 días.</strong> Los cambios significativos de ingresos generalmente ocurren en 60-90 días. Tuvimos creadoras que alcanzaron $10K/mes en 8 semanas desde el inicio. Tus resultados dependen de tu punto de partida, nicho y compromiso con nuestro sistema probado. La consulta te dará un cronograma realista para tu situación específica.',
            q3: '🔒 ¿Mi cuenta e información personal están seguras?',
            a3: 'Absolutamente. <strong>Mantenés el control total y la propiedad de todas tus cuentas.</strong> Usamos protocolos de seguridad estándar de la industria y sistemas encriptados. Podés revocar el acceso instantáneamente en cualquier momento. Gestionamos más de 360 creadoras sin incidentes de seguridad. La transparencia completa y la confianza son innegociables para nosotros.',
            q4: '📝 ¿Estoy obligada a un contrato a largo plazo?',
            a4: 'Sin contratos ni compromisos a largo plazo. Recomendamos 3 meses para implementar nuestro sistema correctamente y ver resultados reales, pero sos libre de cancelar en cualquier momento. <strong>El 97% de nuestras creadoras permanecen más de 12 meses</strong> porque están viendo un crecimiento constante. Nos ganamos tu lealtad a través de resultados, no contratos restrictivos.',
            q5: '🚀 ¿Qué pasa si soy nueva sin seguidores?',
            a5: '<strong>¡Incluso mejor!</strong> Empezar de cero significa no tener malos hábitos que desaprender. Ayudamos a docenas de creadoras a pasar de 0 a 6 cifras. No necesitás seguidores existentes—necesitás la estrategia correcta, consistencia y orientación experta. Proporcionamos las tres. Traé tu autenticidad y disposición para aprender; nos encargaremos del resto.',
            q6: '🤔 ¿Qué hace a ScaleHer diferente de otras agencias?',
            a6: 'Tres cosas: <strong>(1) Resultados Probados</strong> - Más de $50M generados para nuestras creadoras. <strong>(2) Enfoque Femenino</strong> - Entendemos los desafíos únicos que enfrentan las creadoras y construimos estrategias en torno a ellos. <strong>(3) Gestión de Servicio Completo</strong> - Desde estrategia de contenido hasta gestión de DMs y optimización de ingresos, manejamos todo para que puedas enfocarte en crear. Otras agencias ofrecen piezas. Nosotros ofrecemos la solución completa.',
            ctaTitle: '¿Aún no estás segura? Hablemos.',
            ctaSubtitle: 'Reservá una consulta gratuita de 30 minutos. Sin presión, sin obligaciones. Solo respuestas honestas sobre si ScaleHer es adecuada para vos.',
            ctaButton: 'Agendá Tu Consulta Gratuita',
            ctaNote: '💬 <strong>Tiempo de respuesta promedio: 4 horas</strong> • ✓ No se requiere tarjeta de crédito'
        },
        buttons: {
            learnMore: 'Conocé Más',
            getStarted: 'Comenzar',
            apply: 'Aplicar',
            exploreResources: 'Explorar Recursos Gratis',
            viewGuides: 'Ver Guías Gratis',
            scheduleFree: 'Agendá Tu Consulta Gratuita',
            startConsultation: 'Comenzá Tu Consulta Gratuita Ahora',
            scheduleConsultation: 'Agendar Consulta Gratuita'
        }
    },
    pt: {
        nav: {
            education: 'Educação',
            results: 'Resultados',
            system: 'Nosso Sistema',
            stories: 'Histórias',
            apply: 'Aplicar'
        },
        hero: {
            badge: '🔥 Confiado por mais de 360 Criadoras Top',
            title: 'Transforme Seu Conteúdo em um<br><span class="highlight">Negócio de 7 Dígitos</span>',
            subtitle: 'Cuidamos de tudo—DMs, estratégia, crescimento, monetização—para você focar em criar enquanto ganha <strong>6-7 dígitos.</strong>',
            stats: {
                revenue: '$50M+',
                revenueLabel: 'Gerado para Criadoras',
                reach: '350M+',
                reachLabel: 'Alcance Total'
            },
            cta: 'Obtenha Sua Sessão Estratégica Grátis',
            ctaNote: '💬 Consulta gratuita • Sem compromisso • Veja seu roteiro personalizado em 24 horas',
            socialProof: '<strong>97% de taxa de sucesso</strong> • Junte-se a criadoras ganhando $10K-$150K/mês'
        },
        form: {
            title: 'Pronta para Escalar?',
            subtitle: 'Solicite sua consulta estratégica gratuita de 30 minutos. Mostraremos exatamente como chegar aos 6 dígitos.',
            name: 'Seu Nome',
            email: 'E-mail',
            instagram: 'Usuário do Instagram',
            phone: 'Número de Telefone',
            platforms: 'Selecione Suas Plataformas (escolha todas que se aplicam) *',
            income: 'Renda Mensal Atual ($)',
            challenge: 'Conte-nos seu maior desafio...',
            submit: 'Agendar Consulta Gratuita',
            note: 'Entraremos em contato em 24 horas com sua estratégia personalizada.'
        },
        faq: {
            title: 'Ainda Tem Dúvidas?',
            subtitle: 'Tudo o que você precisa saber antes de dar o próximo passo',
            q1: '💰 Quanto realmente custa trabalhar com a ScaleHer?',
            a1: 'Oferecemos pacotes personalizados com base em onde você está em sua jornada. Seja começando ou já ganhando 6 dígitos, temos um plano que se encaixa. <strong>A verdadeira questão não é o custo—é o ROI.</strong> Nossa criadora média vê um aumento de receita de 300% em 6 meses. Reserve uma consulta gratuita e criaremos um plano personalizado para seus objetivos.',
            q2: '⏱️ Com que rapidez verei resultados reais?',
            a2: '<strong>A maioria das criadoras vê um crescimento de 20-40% nos primeiros 30 dias.</strong> Mudanças significativas de renda normalmente ocorrem em 60-90 dias. Tivemos criadoras atingindo $10K/mês em 8 semanas desde o início. Seus resultados dependem do seu ponto de partida, nicho e compromisso em seguir nosso sistema comprovado. A consulta lhe dará um cronograma realista para sua situação específica.',
            q3: '🔒 Minha conta e informações pessoais estão seguras?',
            a3: 'Absolutamente. <strong>Você mantém controle total e propriedade de todas as suas contas.</strong> Usamos protocolos de segurança padrão da indústria e sistemas criptografados. Você pode revogar o acesso instantaneamente a qualquer momento. Gerenciamos mais de 360 criadoras sem incidentes de segurança. Transparência completa e confiança são inegociáveis para nós.',
            q4: '📝 Estou presa a um contrato de longo prazo?',
            a4: 'Sem contratos ou compromissos de longo prazo. Recomendamos 3 meses para implementar adequadamente nosso sistema e ver resultados reais, mas você é livre para cancelar a qualquer momento. <strong>97% de nossas criadoras ficam 12+ meses</strong> porque estão vendo crescimento consistente. Ganhamos sua lealdade através de resultados, não contratos restritivos.',
            q5: '🚀 E se eu for completamente nova sem seguidores?',
            a5: '<strong>Ainda melhor!</strong> Começar do zero significa não ter maus hábitos para desaprender. Ajudamos dezenas de criadoras a irem de 0 a 6 dígitos. Você não precisa de seguidores existentes—você precisa da estratégia certa, consistência e orientação especializada. Fornecemos todos os três. Traga sua autenticidade e disposição para aprender; cuidaremos do resto.',
            q6: '🤔 O que torna a ScaleHer diferente de outras agências?',
            a6: 'Três coisas: <strong>(1) Resultados Comprovados</strong> - Mais de $50M gerados para nossas criadoras. <strong>(2) Abordagem Feminina</strong> - Entendemos os desafios únicos que as criadoras enfrentam e construímos estratégias em torno deles. <strong>(3) Gestão de Serviço Completo</strong> - Desde estratégia de conteúdo até gerenciamento de DMs e otimização de receita, cuidamos de tudo para você focar em criar. Outras agências oferecem peças. Nós oferecemos a solução completa.',
            ctaTitle: 'Ainda não tem certeza? Vamos conversar.',
            ctaSubtitle: 'Agende uma consulta gratuita de 30 minutos. Sem pressão, sem obrigações. Apenas respostas honestas sobre se a ScaleHer é adequada para você.',
            ctaButton: 'Agende Sua Consulta Gratuita',
            ctaNote: '💬 <strong>Tempo médio de resposta: 4 horas</strong> • ✓ Não é necessário cartão de crédito'
        },
        buttons: {
            learnMore: 'Saiba Mais',
            getStarted: 'Começar',
            apply: 'Aplicar',
            exploreResources: 'Explorar Recursos Grátis',
            viewGuides: 'Ver Guias Grátis',
            scheduleFree: 'Agende Sua Consulta Gratuita',
            startConsultation: 'Comece Sua Consulta Gratuita Agora',
            scheduleConsultation: 'Agendar Consulta Gratuita'
        }
    }
};

const langConfig = {
    en: { flag: '🇺🇸', text: 'EN', name: 'English' },
    es: { flag: '🇪🇸', text: 'ES', name: 'Español' },
    ar: { flag: '🇦🇷', text: 'AR', name: 'Argentino' },
    pt: { flag: '🇧🇷', text: 'PT', name: 'Português' }
};

// Get current language from localStorage or default to English
let currentLang = localStorage.getItem('language') || 'en';

// Initialize language selector
document.addEventListener('DOMContentLoaded', () => {
    const langBtn = document.getElementById('currentLang');
    const langDropdown = document.getElementById('langDropdown');
    const langOptions = document.querySelectorAll('.lang-option');

    if (!langBtn || !langDropdown) return;

    // Set initial language
    updateLanguage(currentLang);

    // Toggle dropdown
    langBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', () => {
        langDropdown.classList.remove('show');
    });

    // Language selection
    langOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            const lang = option.dataset.lang;
            if (lang && lang !== currentLang) {
                currentLang = lang;
                localStorage.setItem('language', lang);
                updateLanguage(lang);
            }
            langDropdown.classList.remove('show');
        });
    });
});

function updateLanguage(lang) {
    const t = translations[lang];
    if (!t) return;

    const config = langConfig[lang];

    // Update language button
    const langBtn = document.getElementById('currentLang');
    if (langBtn) {
        langBtn.querySelector('.flag').textContent = config.flag;
        langBtn.querySelector('.lang-text').textContent = config.text;
    }

    // Update active state in dropdown
    document.querySelectorAll('.lang-option').forEach(opt => {
        opt.classList.toggle('active', opt.dataset.lang === lang);
    });

    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const value = getNestedValue(t, key);
        if (value) {
            el.innerHTML = value;
        }
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        const value = getNestedValue(t, key);
        if (value) {
            el.placeholder = value;
        }
    });

    // Update hero section
    const heroBadge = document.querySelector('.hero-badge span');
    if (heroBadge) heroBadge.innerHTML = t.hero.badge;

    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) heroTitle.innerHTML = t.hero.title;

    const heroSubheading = document.querySelector('.hero-subheading');
    if (heroSubheading) heroSubheading.innerHTML = t.hero.subtitle;

    // Update stats
    const stats = document.querySelectorAll('.hero-stats .stat');
    if (stats.length >= 2) {
        stats[0].querySelector('.stat-label').textContent = t.hero.stats.revenueLabel;
        stats[1].querySelector('.stat-label').textContent = t.hero.stats.reachLabel;
    }

    const heroCta = document.querySelector('.btn-hero');
    if (heroCta) heroCta.childNodes[0].textContent = t.hero.cta + ' ';

    const heroCtaNote = document.querySelector('.hero-cta-note');
    if (heroCtaNote) heroCtaNote.innerHTML = t.hero.ctaNote;

    const socialProofText = document.querySelector('.proof-text p');
    if (socialProofText) socialProofText.innerHTML = t.hero.socialProof;

    // Update buttons with specific classes
    updateButtons(t.buttons);
}

function updateButtons(buttons) {
    // Education CTA buttons
    document.querySelectorAll('a[href="education.html"].btn').forEach(btn => {
        const text = btn.textContent.trim();
        if (text.includes('Explore') || text.includes('Explorar')) {
            btn.childNodes[0].textContent = buttons.exploreResources + ' ';
        } else if (text.includes('View') || text.includes('Ver') || text.includes('Mirá')) {
            btn.childNodes[0].textContent = buttons.viewGuides + ' ';
        }
    });

    // Other CTA buttons
    document.querySelectorAll('.btn-primary:not(.btn-hero)').forEach(btn => {
        const text = btn.textContent.trim().toLowerCase();
        if (text.includes('schedule') || text.includes('agenda') || text.includes('agendá') || text.includes('agende')) {
            if (btn.textContent.length > 50) {
                btn.textContent = buttons.scheduleFree;
            } else {
                btn.textContent = buttons.scheduleConsultation;
            }
        } else if (text.includes('start') || text.includes('comienza') || text.includes('começá') || text.includes('comece')) {
            btn.textContent = buttons.startConsultation;
        } else if (text.includes('get started') || text.includes('comenzar') || text.includes('começar')) {
            btn.textContent = buttons.getStarted;
        }
    });

    // Pricing buttons
    const pricingBtns = document.querySelectorAll('.pricing-card .btn');
    if (pricingBtns.length >= 3) {
        pricingBtns[0].textContent = buttons.learnMore;
        pricingBtns[1].textContent = buttons.getStarted;
        pricingBtns[2].textContent = buttons.apply;
    }
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((prev, curr) => prev?.[curr], obj);
}

// =============================
// CONSOLE EASTER EGG
// =============================
console.log(
    '%cScaleHer 💎',
    'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #E49999 0%, #D17C7C 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; padding: 10px;'
);
console.log(
    '%cBuilding 7-figure empires for female creators.',
    'font-size: 14px; color: #999;'
);
console.log(
    '%cInterested in joining our team? Email: careers@scaleher.com',
    'font-size: 12px; color: #666;'
);
