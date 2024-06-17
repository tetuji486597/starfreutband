// JavaScript to handle the events and contact form

// Sample data for upcoming events
const events = [
    { date: '2024-06-15', venue: 'Rock Arena', location: 'Los Angeles, CA' },
    { date: '2024-07-20', venue: 'Stadium X', location: 'New York, NY' },
    { date: '2024-08-05', venue: 'Music Hall', location: 'Chicago, IL' }
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



// script.js

document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('header');
    const logo = document.getElementById('logo');
    const smallLogo = document.getElementById('small-logo');
    const nav = document.querySelector('header nav');
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const fadeInElements = document.querySelectorAll('.fade-in');

    const isElementInViewport = (el) => {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    const checkFadeInElements = () => {
        fadeInElements.forEach(el => {
            if (isElementInViewport(el)) {
                el.classList.add('fade-in-visible');
            }
        });
    };

    window.addEventListener('scroll', checkFadeInElements);
    window.addEventListener('resize', checkFadeInElements);

    // Initial check in case any elements are already in view
    checkFadeInElements();
    
    loadEvents();

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

    // Initial check on page load
    handleHeaderCollapse();

    // Event listener for scroll
    window.addEventListener('scroll', handleHeaderCollapse);

     // Go to index.html when logo is clicked
     logo.addEventListener('click', function() {
        window.location.href = 'index.html';
    });
});

