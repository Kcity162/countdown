let countdownInterval;
const API_KEY = 'AIzaSyCKdG_iM946mewu5RInoVvJ1ED_S-KZPZI';
const CLIENT_ID = '769884879774-heoerr8safevh14ie8uk03f1pp3i4oa7.apps.googleusercontent.com';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
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
        var signedIn = gapi.auth2.getAuthInstance().isSignedIn
        
        signedIn.listen(updateSigninStatus);
        updateSigninStatus(signedIn.get());
        
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
        'maxResults': 5,
        'orderBy': 'startTime'
    }).then(function(response) {
        const events = response.result.items;
        let event0Name = events[0].summary
        let event0IsoDate = events[0].start.dateTime
        let event0Date = new Date(event0IsoDate);
        const event0ReadablereadableDate = event0Date.toLocaleString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});


        let event1Name = events[1].summary
        let event1IsoDate = events[1].start.dateTime
        let event1Date = new Date(event1IsoDate);
        const event1ReadablereadableDate = event1Date.toLocaleString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });


        let event2Name = events[2].summary
        let event2IsoDate = events[2].start.dateTime
        let event2Date = new Date(event2IsoDate);
        const event2ReadablereadableDate = event2Date.toLocaleString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        let event3Name = events[3].summary
        let event3IsoDate = events[3].start.dateTime
        let event3Date = new Date(event3IsoDate);
        const event3ReadablereadableDate = event3Date.toLocaleString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        let event4Name = events[4].summary
        let event4IsoDate = events[4].start.dateTime
        let event4Date = new Date(event4IsoDate);
        const event4ReadablereadableDate = event4Date.toLocaleString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });



        document.getElementById("event0").textContent = event0Name;
        document.getElementById("event0Start").textContent = event0ReadablereadableDate;
        document.getElementById("event1").textContent = event1Name;
        document.getElementById("event1Start").textContent = event1ReadablereadableDate;
        document.getElementById("event2").textContent = event2Name;
        document.getElementById("event2Start").textContent = event2ReadablereadableDate;
        document.getElementById("event3").textContent = event3Name;
        document.getElementById("event3Start").textContent = event3ReadablereadableDate;
        document.getElementById("event4").textContent = event4Name;
        document.getElementById("event4Start").textContent = event4ReadablereadableDate;


        if (events.length > 0) {
            if (new Date(events[0].start.dateTime).getTime() < new Date().getTime()) {
                showEvent(events[1])
            } else {
                showEvent(events[0])
            }
        } else {
            document.getElementById('eventDetails').textContent = 'No upcoming events found.';
        }
    }).catch(function(error) {
        console.error('Error fetching events:', error);
        document.getElementById('eventDetails').textContent = 'Error fetching events.';
    });
}

function showEvent(event) {
    const eventTitle = event.summary || 'No title';
    const startTime = event.start.dateTime || event.start.date;

    // Update event details
    document.getElementById('eventDetails').innerHTML = `${eventTitle}`;
    document.getElementById("loginButton").style.display = "none";
    // Update countdown input field with the next event's start time
    const countdownInput = document.getElementById("countdownDate");
    countdownInput.value = startTime.slice(0, 16);  // Format for input field
    startCountdown();
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
startCountdown();
}


// Run the function every 10sec
setInterval(myFunction, 10000);