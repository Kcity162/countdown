from icalendar import Calendar, Event
from datetime import datetime
import pytz

# Define timezone and create calendar
tz = pytz.timezone("Europe/London")
cal = Calendar()

# Add events
events = [
    {"summary": "Lunch & flow", "start": "2024-09-02 12:00", "end": "2024-09-02 13:00"},
    {"summary": "Canceled: Manchester", "start": "2024-09-02 09:30", "end": "2024-09-02 10:30"},
    {"summary": "Canceled: EDF KAR", "start": "2024-09-02 14:30", "end": "2024-09-02 15:30"},
    {"summary": "Richard <> Kev", "start": "2024-09-04 13:30", "end": "2024-09-04 14:30"},
    {"summary": "Pickup kids", "start": "2024-09-04 16:00", "end": "2024-09-04 17:00"},
    {"summary": "Lunch & flow", "start": "2024-09-06 12:00", "end": "2024-09-06 13:00"},
    {"summary": "Bee Together", "start": "2024-09-06 16:30", "end": "2024-09-06 17:30"},
    {"summary": "Canceled: Green R", "start": "2024-09-07 10:00", "end": "2024-09-07 11:00"},
    {"summary": "Canceled: D&R Practice Lead", "start": "2024-09-07 14:00", "end": "2024-09-07 15:00"},
    {"summary": "Kevin/Jim catch up", "start": "2024-09-08 15:00", "end": "2024-09-08 16:00"},
    # Add more events as needed
]

# Create events and add to calendar
for event in events:
    ical_event = Event()
    ical_event.add("summary", event["summary"])
    ical_event.add("dtstart", tz.localize(datetime.strptime(event["start"], "%Y-%m-%d %H:%M")))
    ical_event.add("dtend", tz.localize(datetime.strptime(event["end"], "%Y-%m-%d %H:%M")))
    cal.add_component(ical_event)

# Save to .ics file
with open('kevin_calendar.ics', 'wb') as f:
    f.write(cal.to_ical())
