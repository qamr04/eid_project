document.addEventListener('DOMContentLoaded', () => {
    // 1. Datum instellen voor Eid Mubarak
    // Aangezien Eid NU is, zetten we de datum in het verleden om direct de 'Eid Mubarak!' boodschap te tonen.
    const eidDate = new Date().getTime() - 1000; // 1 seconde in het verleden

    const daysSpan = document.getElementById('days');
    const hoursSpan = document.getElementById('hours');
    const minutesSpan = document.getElementById('minutes');
    const secondsSpan = document.getElementById('seconds');
    const countdownMessage = document.getElementById('countdown-message');
    const countdownTimerDiv = document.getElementById('timer'); // De div die de tijdvakken bevat

    function updateCountdown() {
        const currentTime = new Date().getTime();
        const distance = eidDate - currentTime;

        if (distance < 0) {
            clearInterval(countdownInterval);
            if (countdownMessage) {
                countdownMessage.innerHTML = 'Eid Mubarak! Moge jouw dag gevuld zijn met zegeningen!';
                // Verberg de aftellingstijdvakken direct
                if (countdownTimerDiv) {
                    countdownTimerDiv.style.display = 'none';
                }
            }
            return;
        }

        // Deze code zal in dit scenario niet worden bereikt, maar is essentieel als je de datum zou aanpassen naar de toekomst
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (daysSpan) daysSpan.innerHTML = String(days).padStart(2, '0');
        if (hoursSpan) hoursSpan.innerHTML = String(hours).padStart(2, '0');
        if (minutesSpan) minutesSpan.innerHTML = String(minutes).padStart(2, '0');
        if (secondsSpan) secondsSpan.innerHTML = String(seconds).padStart(2, '0');
    }

    // Update de aftelling elke seconde (zal direct de "Eid Mubarak!" boodschap triggeren)
    const countdownInterval = setInterval(updateCountdown, 1000);
    // Voer direct een update uit bij het laden van de pagina
    updateCountdown();

    // 2. Smooth Scrolling voor navigatielinks
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Voorkom standaard spronggedrag

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = document.querySelector('.main-header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // 3. Scroll-onthulling Animaties
    const animateOnScrollElements = document.querySelectorAll('.animate-slide-up-on-scroll');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop met observeren nadat het zichtbaar is
            }
        });
    }, {
        threshold: 0.2, // Trigger wanneer 20% van het element zichtbaar is
        rootMargin: '0px 0px -50px 0px' // Start de animatie iets eerder
    });

    animateOnScrollElements.forEach(element => {
        observer.observe(element);
    });

    // 4. Initiële fade-in animatie voor header en hero-content
    const header = document.querySelector('.main-header');
    const heroContent = document.querySelector('.hero-content');
    if (header) header.classList.add('is-visible');
    if (heroContent) heroContent.classList.add('is-visible');

    // 5. "Wishes" functionaliteit (client-side only)
    const submitWishButton = document.getElementById('submitWish');
    const wishTextInput = document.getElementById('wishText');
    const wishOutputDiv = document.getElementById('wishOutput');

    if (submitWishButton && wishTextInput && wishOutputDiv) {
        submitWishButton.addEventListener('click', () => {
            const wishText = wishTextInput.value.trim();

            if (wishText) {
                const wishItem = document.createElement('div');
                wishItem.classList.add('wish-item');
                wishItem.textContent = wishText;
                wishOutputDiv.prepend(wishItem); // Voeg de nieuwe wens bovenaan toe
                wishTextInput.value = ''; // Leeg het tekstveld
            } else {
                alert('Schrijf alsjeblieft een wens voordat je deze verstuurt!');
            }
        });
    }

    // 6. Achtergrond media controle (afbeelding is nu primair)
    const backgroundVideo = document.querySelector('.background-video');
    const backgroundImage = document.querySelector('.background-image');

    // Zorg ervoor dat de achtergrondafbeelding direct zichtbaar is bij het laden
    if (backgroundImage) {
        backgroundImage.style.opacity = '1';
        backgroundImage.style.visibility = 'visible';
    }

    // Probeer de video te laden, maar geef prioriteit aan de afbeelding
    if (backgroundVideo) {
        backgroundVideo.oncanplaythrough = () => {
            // Als video werkt, fade de afbeelding uit en speel video af
            if (backgroundImage) {
                backgroundImage.style.opacity = '0';
                backgroundImage.style.visibility = 'hidden';
            }
            backgroundVideo.style.opacity = '1';
            backgroundVideo.style.visibility = 'visible';
            backgroundVideo.play().catch(e => console.error("Video autoplay error:", e));
        };
        backgroundVideo.onerror = () => {
            console.warn("Video failed to load or play, sticking with image background.");
            // Zorg ervoor dat de afbeelding zichtbaar blijft
            if (backgroundImage) {
                backgroundImage.style.opacity = '1';
                backgroundImage.style.visibility = 'visible';
            }
        };
        // Laad video, maar wacht met tonen tot 'oncanplaythrough'
        backgroundVideo.load();
    }
});