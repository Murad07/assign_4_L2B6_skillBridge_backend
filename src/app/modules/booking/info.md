my json data for booking:
{
  "studentId": "QJX5JhQ6tjJP9tZZXOobTfIIELZBFSgs",
  "tutorId": "cmky0zp270000ccd186nste98",
  "sessionDate": "2026-02-02",
  "sessionTime": "10:00",
  "duration": 60,
  "subject": "React",
  "price": 800,
  "notes": "Need help with algebra and basic calculus",
  "status": "CONFIRMED",
  "meetingLink": "https://skillbridge.com/meet/..."
}


and my tuto availability:
"availability": [
      {
        "day": "Monday",
        "slots": ["09:00-10:00", "10:00-11:00", "14:00-15:00"]
      },
      {
        "day": "Wednesday",
        "slots": ["09:00-10:00", "11:00-12:00"]
      }
    ]


    booking.service get:
    availability: [
    { day: 'Monday', slots: [Array] },
    { day: 'Wednesday', slots: [Array] }
  ]