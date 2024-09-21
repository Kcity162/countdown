let countdownInterval;
        const CLIENT_ID = '769884879774-heoerr8safevh14ie8uk03f1pp3i4oa7.apps.googleusercontent.com';
        const API_KEY = 'AIzaSyBu04Y579ndaDSIOYJWAu90GYgqtd31jf0';
        const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
        const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
        let eventCheckInterval = null;

        window.onload = function() {
            loadGoogleAPI();
        };

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
                updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            });
        }

        function updateSigninStatus(isSignedIn) {
            if (isSignedIn) {
                startEventCheckInterval(); // Start checking for events
            }
        }

        // Sign in the user upon button click
        function handleAuthClick() {
            gapi.auth2.getAuthInstance().signIn();
        }

        function handleCredentialResponse(response) {
            const token = response.credential; // Extract the credential token
        
            // Initialize the Google API client using the token
            gapi.load('client', async function() {
                await gapi.client.init({
                    apiKey: API_KEY,
                    discoveryDocs: DISCOVERY_DOCS
                });
        
                // Set the authorization token
                gapi.client.setToken({ access_token: token });
        
                // Now list the upcoming events
                listUpcomingEvents();
            });
        }

        // Periodically check for new events
        function startEventCheckInterval() {
            if (eventCheckInterval) clearInterval(eventCheckInterval); // Clear any existing interval
            eventCheckInterval = setInterval(listUpcomingEvents, 60000); // Check every 60 seconds
            listUpcomingEvents(); // Run immediately
        }

        // Fetch the next upcoming event and update the countdown
        function listUpcomingEvents() {
            gapi.client.calendar.events.list({
                'calendarId': 'kevin.torrington@gmail.com',
                'timeMin': (new Date()).toISOString(),
                'showDeleted': false,
                'singleEvents': true,
                'maxResults': 1,
                'orderBy': 'startTime'
            }).then(function(response) {
                const events = response.result.items;
                const eventDetailsElement = document.getElementById('eventDetails');
                
                if (events.length > 0) {
                    const nextEvent = events[0];
                    const eventTitle = nextEvent.summary || 'No title';
                    const startTime = nextEvent.start.dateTime || nextEvent.start.date;
                    
                    // Update event details
                    eventDetailsElement.innerHTML = `Next Event: <strong>${eventTitle}</strong> at <strong>${new Date(startTime).toLocaleString()}</strong>`;
                    
                    // Update countdown input field with the next event's start time
                    const countdownInput = document.getElementById("countdownDate");
                    countdownInput.value = startTime.slice(0, 16);  // Format for input field
                    
                    // Automatically start the countdown
                    startCountdown(new Date(startTime));
                } else {
                    eventDetailsElement.textContent = 'No upcoming events found.';
                }
            }).catch(function(error) {
                console.error('Error fetching events:', error);
                document.getElementById('eventDetails').textContent = 'Error fetching events.';
            });
        }

        // Start the countdown based on the event's start time
        function startCountdown(eventTime) {
            if (countdownInterval) clearInterval(countdownInterval); // Clear any existing countdown interval

            countdownInterval = setInterval(function() {
                const now = new Date().getTime();
                const distance = eventTime.getTime() - now;

                if (distance < 0) {
                    clearInterval(countdownInterval);
                    document.getElementById("alarmSound").play();
                    // You can add flashing red cards or additional behaviors here
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

            }, 1000); // Update every second
        }