// script.js
document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       1. Mobile Menu Nav Toggle
       ========================================= */
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('mobile-active');
        });
    }

    // Close mobile menu on link click
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('mobile-active')) {
                nav.classList.remove('mobile-active');
            }
        });
    });

    /* =========================================
       2. Hero Slider Logic
       ========================================= */
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    if (slides.length > 0) {
        let currentSlide = 0;
        let slideInterval;

        const showSlide = (index) => {
            slides.forEach(slide => slide.classList.remove('active'));
            
            if (index >= slides.length) {
                currentSlide = 0;
            } else if (index < 0) {
                currentSlide = slides.length - 1;
            } else {
                currentSlide = index;
            }
            
            slides[currentSlide].classList.add('active');
        };

        const nextSlide = () => showSlide(currentSlide + 1);
        const prevSlide = () => showSlide(currentSlide - 1);

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetInterval();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetInterval();
        });

        // Auto slide every 5 seconds
        const startInterval = () => {
            slideInterval = setInterval(nextSlide, 5000);
        };

        const resetInterval = () => {
            clearInterval(slideInterval);
            startInterval();
        };

        startInterval();
    }

    /* =========================================
       3. Intersection Observer (Fade-in Up)
       ========================================= */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const animateOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => animateOnScroll.observe(el));

    /* =========================================
       4. FAQ Accordion Logic
       ========================================= */
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');
            
            // Close other open items
            const activeItems = document.querySelectorAll('.accordion-item.active');
            activeItems.forEach(activeItem => {
                if (activeItem !== item) {
                    activeItem.classList.remove('active');
                    activeItem.querySelector('.accordion-content').style.maxHeight = null;
                }
            });

            // Toggle current item
            item.classList.toggle('active');
            
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    /* =========================================
       5. Chatbot Logic
       ========================================= */
    const chatbotTrigger = document.getElementById('chatbotTrigger');
    const chatbotWindow = document.getElementById('chatbotWindow');
    const closeChatbot = document.getElementById('closeChatbot');
    const chatbotBody = document.getElementById('chatbotBody');
    const chatInput = document.getElementById('chatInput');
    const sendChat = document.getElementById('sendChat');

    if (chatbotTrigger && chatbotWindow) {
        // Toggle Chatbot Window
        chatbotTrigger.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
        });

        // Close Chatbot
        closeChatbot.addEventListener('click', () => {
            chatbotWindow.classList.remove('active');
        });

        // Add User Message
        const addUserMessage = (text) => {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('chat-message', 'user');
            msgDiv.textContent = text;
            chatbotBody.appendChild(msgDiv);
            scrollToBottom();
        };

        // Add Bot Message
        const addBotMessage = (text) => {
            const msgDiv = document.createElement('div');
            msgDiv.classList.add('chat-message', 'bot');
            msgDiv.textContent = text;
            chatbotBody.appendChild(msgDiv);
            scrollToBottom();
        };

        const scrollToBottom = () => {
            chatbotBody.scrollTop = chatbotBody.scrollHeight;
        };

        const handleSendMessage = () => {
            const text = chatInput.value.trim();
            if (text !== '') {
                addUserMessage(text);
                chatInput.value = '';
                
                // Simulate Bot Response with delay
                setTimeout(() => {
                    const responses = [
                        "¡Un asesor se pondrá en contacto contigo muy pronto!",
                        "Recuerda que nuestros Bootcamps son 100% financiados. ¡No dudes en inscribirte!",
                        "Si tienes problemas con el formulario, verifica que todos los campos estén llenos.",
                        "Gracias por escribirnos. ¿En qué más podemos ayudarte hoy?",
                        "Nuestras clases son virtuales, con instructores expertos en el área."
                    ];
                    const randomText = responses[Math.floor(Math.random() * responses.length)];
                    addBotMessage(randomText);
                }, 1200);
            }
        };

        // Send on button click
        sendChat.addEventListener('click', handleSendMessage);

        // Send on Enter key
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSendMessage();
            }
        });
    }
});
