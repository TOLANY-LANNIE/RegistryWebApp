export interface Event {
    Title: string; // Title of the event
    Description: string; // Description of the event
    StartDate: any; // Start Date of the event
    EndDate: any; //End  Date of the event
    Location: string; // Location of the event
    Capacity: number; // Maximum capacity of attendees for the event
    Status: boolean; // Status of the event (active/inactive)
    Agenda: string[]; // List of agenda items
    Banner:string;
    uid: string;  // User ID of the event creator
  }
  