document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('bubbles-container');

  // Dati delle bolle (copiati dal tuo componente originale)
  const bubblesData = [
    { id: 1, size: 280, x: 15, y: 20, delay: 0, duration: 8, opacity: 0.12, blur: 0 },
    { id: 2, size: 180, x: 75, y: 15, delay: 1, duration: 10, opacity: 0.08, blur: 20 },
    { id: 3, size: 120, x: 60, y: 65, delay: 2, duration: 7, opacity: 0.15, blur: 0 },
    { id: 4, size: 200, x: 85, y: 55, delay: 0.5, duration: 9, opacity: 0.06, blur: 30 },
    { id: 5, size: 90, x: 30, y: 70, delay: 3, duration: 6, opacity: 0.1, blur: 10 },
    { id: 6, size: 150, x: 50, y: 35, delay: 1.5, duration: 11, opacity: 0.07, blur: 40 },
    { id: 7, size: 60, x: 90, y: 80, delay: 2.5, duration: 7, opacity: 0.18, blur: 0 },
  ];

  bubblesData.forEach((b) => {
    const bubble = document.createElement('div');
    
    // Applichiamo gli stili direttamente come faceva React
    Object.assign(bubble.style, {
      position: 'absolute',
      width: `${b.size}px`,
      height: `${b.size}px`,
      left: `${b.x}%`,
      top: `${b.y}%`,
      borderRadius: '50%',
      // Usiamo le variabili colore HSL che abbiamo nel CSS
      background: `radial-gradient(circle at 30% 30%, hsla(12, 100%, 64%, ${b.opacity + 0.05}), hsla(14, 100%, 78%, ${b.opacity}), transparent 70%)`,
      filter: b.blur > 0 ? `blur(${b.blur}px)` : 'none',
      animation: `float ${b.duration}s infinite ease-in-out`,
      animationDelay: `${b.delay}s`,
      pointerEvents: 'none'
    });

    container.appendChild(bubble);
  });
});



//SECTION PORTFOLIO///
// Aggiungi questo dentro il DOMContentLoaded nel tuo script.js
// Seleziona tutte le sezioni che devono animarsi allo scroll
const animatedSections = document.querySelectorAll('.framer-hidden');

// Crea l'osservatore
const observerOptions = {
  root: null,
  rootMargin: '-100px', // Corrisponde a margin: "-100px" di framer-motion
  threshold: 0
};

const sectionObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    // Se la sezione entra nello schermo
    if (entry.isIntersecting) {
      entry.target.classList.add('framer-visible');
      // Corrisponde a once: true (smette di osservare dopo che è apparsa)
      observer.unobserve(entry.target); 
    }
  });
}, observerOptions);

// Inizializza l'osservatore per ogni sezione
animatedSections.forEach(section => {
  sectionObserver.observe(section);
});


///navbar///
// script.js

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar-alien');
    
    // Funzione Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Opzionale: chiudi il menu mobile quando clicchi un link
    const navLinks = document.querySelectorAll('.nav-link');
    const menuToggle = document.getElementById('navMain');
    const bsCollapse = new bootstrap.Collapse(menuToggle, {toggle:false});
    
    navLinks.forEach((l) => {
        l.addEventListener('click', () => { 
            if(window.innerWidth < 768) { bsCollapse.hide(); }
        });
    });
});


///about///
document.addEventListener('DOMContentLoaded', () => {
  // Intersection Observer per le animazioni Reveal Up
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // L'animazione parte quando il 15% dell'elemento è visibile
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Anima solo la prima volta
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-up').forEach((el) => {
    observer.observe(el);
  });
});



///EmailJS///

  (function() {
    emailjs.init({
        publicKey: "Z0r20YlEb2aWizdzc", 
    });
})();

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        const messageDisplay = document.getElementById('form-message');
        const submitButton = document.getElementById('submit-button');
        
        form.addEventListener('submit', function(event) {
            event.preventDefault(); 
            
            submitButton.disabled = true;
            submitButton.textContent = 'SENDING...';
            messageDisplay.style.display = 'none';

            emailjs.sendForm('service_3y532vq', 'template_mi319rm', this)
                .then(function() {
                    // Success
                    messageDisplay.textContent = 'Messaggio inviato con successo! Ti risponderò al più presto.';
                    messageDisplay.className = 'mt-3 text-center alert alert-success d-block'; 
                    form.reset();
                }, function(error) {
                    // Error
                    console.error('EmailJS Error:', error);
                    messageDisplay.textContent = 'Errore nell\'invio del messaggio. Riprova più tardi oppure contattami direttamente a donnicolajessica@gmail.com';
                    messageDisplay.className = 'mt-3 text-center alert alert-danger d-block';
                })
                .finally(function() {
                    // Ripristina il bottone
                    submitButton.disabled = false;
                    submitButton.textContent = 'INVIA MESSAGGIO';
                });
        });
    }
});