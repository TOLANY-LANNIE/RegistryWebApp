export interface Event {
    id: string; // Unique identifier for the event
    title: string; // Title of the event
    description: string; // Description of the event
    date: Date; // Date of the event
    location: string; // Location of the event
    capacity: number; // Maximum capacity of attendees for the event
  }
  