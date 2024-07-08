// JavaScript to handle the events and contact form

// Sample data for upcoming events
const events = [
    { date: '2024-', venue: 'Book Us!', location: 'Houston' },
    { date: '2024-', venue: 'Book Us!', location: 'Houston' },
    { date: '2024-', venue: 'Book Us!', location: 'Houston' }
];

// Function to load events into the event list
function loadEvents() {
    const eventList = document.getElementById('event-list');
    events.forEach(event => {
        const listItem = document.createElement('li');
        listItem.textContent = `${event.date} - ${event.venue}, ${event.location}`;
        eventList.appendChild(listItem);
    });
}


document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('header');
    const logo = document.getElementById('logo');
    const smallLogo = document.getElementById('small-logo');
    const nav = document.querySelector('header nav');
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const fadeInElements = document.querySelectorAll('.fade-in');
    const previewAudios = document.querySelectorAll('.preview-audio');
    window.onscroll = function() {handleHeaderCollapse()};
    function handleHeaderCollapse() {
        if (window.scrollY > 50) {
            header.classList.add('collapsed');
            logo.classList.add('hidden');
            smallLogo.style.display = 'block';
            nav.style.justifyContent = 'space-between'; // Adjusting nav alignment when collapsed
        } else {
            header.classList.remove('collapsed');
            logo.classList.remove('hidden');
            smallLogo.style.display = 'none';
            nav.style.justifyContent = 'center'; // Adjusting nav alignment when not collapsed
        }
    }


    previewAudios.forEach(audio => {
        audio.addEventListener('play', function() {
            const messageElement = audio.nextElementSibling;

            setTimeout(() => {
                audio.pause();
                audio.currentTime = 0;
                audio.controls = false; // Disable audio controls
                if (messageElement && messageElement.classList.contains('preview-message')) {
                    messageElement.style.display = 'block'; // Show the message
                }
            }, 30000); // Stop after 30,000 milliseconds (30 seconds)
        });
    });

    // Initial check on page load
    handleHeaderCollapse();

    const isElementInViewport = (el, buffer = 200) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= -buffer &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + buffer &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    const checkFadeInElements = () => {
        fadeInElements.forEach(el => {
            const buffer = el.id === 'video' ? 1000 : 200; // Larger buffer for video section
            if (isElementInViewport(el, buffer)) {
                el.classList.add('fade-in-visible');
            }
        });
    };

    window.addEventListener('scroll', checkFadeInElements);
    window.addEventListener('resize', checkFadeInElements);

    // Initial check in case any elements are already in view
    checkFadeInElements();

    loadEvents();

    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            const formData = new FormData(form);
            fetch(form.action, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            }).then(response => {
                if (response.ok) {
                    formMessage.textContent = 'Thank you for your message!';
                    formMessage.style.color = 'green';
                    form.reset();
                } else {
                    return response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                            formMessage.textContent = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            formMessage.textContent = 'Oops! There was a problem submitting your form';
                        }
                        formMessage.style.color = 'red';
                    });
                }
            }).catch(error => {
                formMessage.textContent = 'Oops! There was a problem submitting your form';
                formMessage.style.color = 'red';
            });
        });
    }

    // Event listener for scroll
    window.addEventListener('scroll', handleHeaderCollapse);

    // Go to index.html when logo is clicked
    if (logo) {
        logo.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
});
