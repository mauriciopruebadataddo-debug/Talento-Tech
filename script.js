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
       4.5 Formulario Inscripción
       ========================================= */
    const formInscripcion = document.getElementById('formInscripcion');
    if (formInscripcion) {
        formInscripcion.addEventListener('submit', (e) => {
            // Prevenimos comportamiento default si queremos que NO recargue la página en lo absoluto,
            // pero como está apuntando a formspree.io, si prevenimos el default no se enviará el correo.
            // Para enviar silenciosamente usaríamos fetch. Haré la petición con fetch para que no se salga de la página.
            e.preventDefault();
            
            const btnSubmit = formInscripcion.querySelector('.btn-submit');
            const originalText = btnSubmit.textContent;
            btnSubmit.textContent = 'Enviando...';
            btnSubmit.disabled = true;

            const formData = new FormData(formInscripcion);
            
            fetch(formInscripcion.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                if (response.ok) {
                    alert('¡Inscripción exitosa! Te hemos enviado un correo con los siguientes pasos.');
                    formInscripcion.reset();
                } else {
                    alert('Hubo un problema con la inscripción. Por favor intenta de nuevo.');
                }
            }).catch(error => {
                alert('Error de conexión. Intenta nuevamente.');
            }).finally(() => {
                btnSubmit.textContent = originalText;
                btnSubmit.disabled = false;
            });
        });
    }

    /* =========================================
       5. Supabase Comments Integration
       ========================================= */
    
    // IMPORTANTE: Reemplaza TU_ANON_KEY con la anon key real proporcionada en el panel de Supabase
    const SUPABASE_URL = 'https://zdukduywjplovfukugfz.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpkdWtkdXl3anBsb3ZmdWt1Z2Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzNjY5NjYsImV4cCI6MjA4ODk0Mjk2Nn0.kox2OPHfNA0Ruz3E6EBdLWu_ZxrlG1iVmrAz2yVKQiM';
    
    let supabase;
    if (window.supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }

    const formComentario = document.getElementById('formComentario');
    const btnComentario = document.getElementById('btnComentario');

    if (formComentario) {
        formComentario.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (SUPABASE_KEY === 'TU_ANON_KEY') {
                alert('Falta configurar la key de Supabase');
                return;
            }

            const nombre = document.getElementById('nombreComentario').value;
            const comentario = document.getElementById('textoComentario').value;

            btnComentario.disabled = true;
            btnComentario.textContent = 'Enviando...';

            try {
                const { error } = await supabase
                    .from('comentarios')
                    .insert([{ nombre, comentario }]);

                if (error) {
                    console.error('Error de Supabase:', error);
                    throw error;
                }

                formComentario.reset();
                alert('¡Gracias! Tu comentario ha sido enviado exitosamente.');
            } catch (error) {
                console.error('Error insertando comentario:', error);
                alert('Hubo un error al enviar el comentario.');
            } finally {
                btnComentario.disabled = false;
                btnComentario.textContent = 'Comentar';
            }
        });
    }

    // Funcion auxiliar para evitar XSS
    function esconderHtml(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    /* =========================================
       6. Chatbase Reset Chat Session
       ========================================= */
    // Limpiamos la memoria del navegador relacionada a chatbase para que cada reload inicie un chat nuevo
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes('chatbase')) {
            localStorage.removeItem(key);
        }
    }

});
const URL = "https://teachablemachine.withgoogle.com/models/Czq1TLOYz/";

let model, webcam, maxPredictions;
let yaSaludo = false;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    webcam = new tmImage.Webcam(300, 300, true);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas);
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);

    let personaDetectada = false;

    for (let i = 0; i < prediction.length; i++) {
        if (prediction[i].className === "Persona" && prediction[i].probability > 0.8) {
            personaDetectada = true;
        }
    }

    const mensaje = document.getElementById("mensaje");

    if (personaDetectada && !yaSaludo) {
        const texto = "Hola, te invito a conocer nuestra página";

        mensaje.innerHTML = "👋 " + texto;

        // 🔊 VOZ
        const voz = new SpeechSynthesisUtterance(texto);
        voz.lang = "es-CO";
        speechSynthesis.speak(voz);

        yaSaludo = true;

    } else if (!personaDetectada) {
        mensaje.innerHTML = "";
        yaSaludo = false;
    }
}
