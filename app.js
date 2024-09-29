let countdownInterval;
const CLIENT_ID = '769884879774-heoerr8safevh14ie8uk03f1pp3i4oa7.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBu04Y579ndaDSIOYJWAu90GYgqtd31jf0';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
var connected = true;
let eventCheckInterval = null;



function loadGoogleAPI() {
    gapi.load('client:auth2', initClient);
}

// Initialize the Google API client
function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle initial sign-in state
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

// Update sign-in status
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        listUpcomingEvents();

    }
}

// Sign in the user upon button click
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

// Fetch the next upcoming event and update the countdown
function listUpcomingEvents() {

    gapi.client.calendar.events.list({
        'calendarId': 'kevin.torrington@googlemail.com',
        'timeMin': (new Date()).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 2,
        'orderBy': 'startTime'
    }).then(function(response) {
        const events = response.result.items;
        const eventDetailsElement = document.getElementById('eventDetails');
        console.log(events);
        if (events.length > 0) {
            const nextEvent = events[0];
            const eventTitle = nextEvent.summary || 'No title';
            const startTime = nextEvent.start.dateTime || nextEvent.start.date;

            // Update event details
            eventDetailsElement.innerHTML = `${eventTitle}`;
            document.getElementById("loginButton").style.display = "none";
            // Update countdown input field with the next event's start time
            const countdownInput = document.getElementById("countdownDate");
            countdownInput.value = startTime.slice(0, 16);  // Format for input field
            startCountdown();
        } else {
            eventDetailsElement.textContent = 'No upcoming events found.';
        }
    }).catch(function(error) {
        console.error('Error fetching events:', error);
        document.getElementById('eventDetails').textContent = 'Error fetching events.';
    });
}

window.onload = function() {
    loadGoogleAPI();

};

function startCountdown() {
    const inputDate = document.getElementById("countdownDate").value;
    const countdownDate = new Date(inputDate).getTime();
    const alarmSound = document.getElementById("alarmSound");

    // Remove the flashing red class if it's present
    const flipCards = document.querySelectorAll('.flip-card');
    flipCards.forEach(card => {
        card.classList.remove('flash-red');
    });

    if (isNaN(countdownDate)) {
        return;
    }

    clearInterval(countdownInterval);

    countdownInterval = setInterval(function () {
        const now = new Date().getTime();
        const distance = countdownDate - now;

if (distance < 0) {
    clearInterval(countdownInterval);

    // Play sound and flash cards
    alarmSound.play();
    flipCards.forEach(card => {
        card.classList.add('flash-red');
    });

    // Automatically fetch the next event and start the countdown
    listUpcomingEvents(); // Fetch and start countdown for the next event

    return;
}


        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = days < 10 ? "0" + days : days;
        document.getElementById("hours").textContent = hours < 10 ? "0" + hours : hours;
        document.getElementById("minutes").textContent = minutes < 10 ? "0" + minutes : minutes;
        document.getElementById("seconds").textContent = seconds < 10 ? "0" + seconds : seconds;

    }, 1000);
}



// Function to adjust time by the specified number of minutes
function adjustTime(minutes) {
    const countdownInput = document.getElementById("countdownDate");
    let currentDate = new Date(countdownInput.value);
    currentDate.setMinutes(currentDate.getMinutes() + minutes);
    const localDate = currentDate.toISOString().slice(0, 16);
    countdownInput.value = localDate;
}
function myFunction() {
listUpcomingEvents();
console.log("This function runs every 60 sec.");
startCountdown();
}


// Run the function every 10sec
setInterval(myFunction, 10000);