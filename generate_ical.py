from icalendar import Calendar, Event
from datetime import datetime
import pytz

# Create a new iCalendar file
cal = Calendar()

# Timezone definition
utc = pytz.UTC

# Events extracted from the PDF, they are tentative placeholders
events = [
    {
        'summary': 'Manchester MG',
        'start': datetime(2024, 9, 2, 15, 30, tzinfo=utc),
        'end': datetime(2024, 9, 2, 16, 30, tzinfo=utc),
    },
    {
        'summary': 'Bee Together: S',
        'start': datetime(2024, 9, 2, 16, 30, tzinfo=utc),
        'end': datetime(2024, 9, 2, 17, 30, tzinfo=utc),
    },
    {
        'summary': 'D&R Practice Lead',
        'start': datetime(2024, 9, 3, 14, 0, tzinfo=utc),
        'end': datetime(2024, 9, 3, 15, 0, tzinfo=utc),
    },
    {
        'summary': 'Richard <> Kev',
        'start': datetime(2024, 9, 3, 13, 30, tzinfo=utc),
        'end': datetime(2024, 9, 3, 14, 30, tzinfo=utc),
    },
    {
        'summary': 'Pickup kids',
        'start': datetime(2024, 9, 4, 16, 0, tzinfo=utc),
        'end': datetime(2024, 9, 4, 17, 0, tzinfo=utc),
    },
    {
        'summary': 'Manchester People',
        'start': datetime(2024, 9, 4, 16, 30, tzinfo=utc),
        'end': datetime(2024, 9, 4, 17, 30, tzinfo=utc),
    },
    {
        'summary': 'BCS - Is it for you?',
        'start': datetime(2024, 9, 5, 14, 0, tzinfo=utc),
        'end': datetime(2024, 9, 5, 15, 0, tzinfo=utc),
    },
    {
        'summary': 'Manchester MG',
        'start': datetime(2024, 9, 6, 15, 30, tzinfo=utc),
        'end': datetime(2024, 9, 6, 16, 30, tzinfo=utc),
    },
    {
        'summary': 'Manchester MG',
        'start': datetime(2024, 9, 7, 15, 30, tzinfo=utc),
        'end': datetime(2024, 9, 7, 16, 30, tzinfo=utc),
    },
    {
        'summary': 'Manchester Month',
        'start': datetime(2024, 9, 10, 10, 30, tzinfo=utc),
        'end': datetime(2024, 9, 10, 11, 30, tzinfo=utc),
    },
    {
        'summary': 'Sustainability at the Office',
        'start': datetime(2024, 9, 11, 11, 30, tzinfo=utc),
        'end': datetime(2024, 9, 11, 12, 30, tzinfo=utc),
    }
]

# Add events to calendar
for event_data in events:
    event = Event()
    event.add('summary', event_data['summary'])
    event.add('dtstart', event_data['start'])
    event.add('dtend', event_data['end'])
    cal.add_component(event)

# Save to .ics file
with open('Calendar_Sept_2024.ics', 'wb') as f:
    f.write(cal.to_ical())
