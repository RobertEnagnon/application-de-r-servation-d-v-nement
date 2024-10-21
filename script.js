const eventList = document.getElementById('event-list');
const form = document.getElementById('form');
const reservationsList = document.getElementById('reservations');
const eventSelect = document.getElementById('event-select');
const successMessage = document.querySelector('.success-message');
const errorMessage = document.querySelector('.error-message');
const modal = document.getElementById('reservation-modal');
const closeModalBtn = document.querySelector('.close-btn');

let events = [];
let reservations = [];
let selectedEvent = null; // Pour stocker l'événement sélectionné

// Fonction pour récupérer les événements depuis le fichier JSON
async function fetchEvents() {
    const response = await fetch('events.json');
    events = await response.json();
    loadEvents();
}

// Fonction pour charger les événements dans le DOM
function loadEvents() {
    eventList.innerHTML = '';
    events.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.innerHTML = `
            <h3>${event.name}</h3>
            <p>Description: ${event.description}</p>
            <p>Emplacement: ${event.location}</p>
            <p>Places disponibles: <span class="available-spots">${event.availableSpots}</span></p>
            <img src="${event.image}" alt="${event.name}" style="width: 100%; border-radius: 5px;">
            <button class="reserve-btn" data-event-id="${event.id}">Réserver</button>
        `;
        eventList.appendChild(eventItem);
    });

    // Ajouter des écouteurs pour les boutons de réservation
    document.querySelectorAll('.reserve-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const eventId = e.target.getAttribute('data-event-id');
            selectedEvent = events.find(event => event.id == eventId);
            openModal();
        });
    });
}

// Fonction pour ouvrir le modal
function openModal() {
    modal.style.display = 'flex';
    document.getElementById('event-select').innerHTML = `<option value="${selectedEvent.id}">${selectedEvent.name}</option>`;
}

// Fonction pour fermer le modal
closeModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

// Fonction pour gérer la soumission du formulaire
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const quantity = parseInt(document.getElementById('quantity').value);
    
    if (selectedEvent && selectedEvent.availableSpots >= quantity) {
        // Réduction du nombre de places disponibles
        selectedEvent.availableSpots -= quantity;

        reservations.push({
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            event: selectedEvent.name,
            quantity: quantity
        });

        // Mise à jour de l'affichage des événements et des réservations
        loadEvents();
        loadReservations();
        successMessage.textContent = "Réservation réussie !";
        errorMessage.textContent = "";

        // Fermer le modal et réinitialiser le formulaire
        form.reset();
        modal.style.display = 'none';
    } else {
        errorMessage.textContent = "Désolé, il n'y a pas suffisamment de places disponibles.";
        successMessage.textContent = "";
    }
});
// Fonction pour charger la liste des réservations avec un design 
function loadReservations() {
    reservationsList.innerHTML = '';
    reservations.forEach(reservation => {
        const li = document.createElement('li');
        li.className = 'reservation-item';
        li.innerHTML = `
            <h3>${reservation.name}</h3>
            <p>Email: ${reservation.email}</p>
            <p>Événement: ${reservation.event}</p>
            <p class="reservation-quantity">Nombre de places: ${reservation.quantity}</p>
        `;
        reservationsList.appendChild(li);
    });
}


// Fonction de changement de thème
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
});

// Initialiser l'application
fetchEvents();
