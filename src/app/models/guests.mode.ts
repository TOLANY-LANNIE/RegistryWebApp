export interface Guest {
    id: number; // Unique identifier for the doctor
    practiseNumber: string; // Practise number of the doctor
    name: string; // Name of the doctor
    surname: string; // Surname of the doctor
    contact: string; // Contact number of the doctor
    email: string; // Email address of the doctor
    transfersRequired: boolean;
    accomodationRequired:boolean;
    flightDate:Date;
    flightDetails: string;
    transferFlight: boolean; // Whether the doctor needs a connecting flight
    transferDetails?: string; // Details about the connecting flight or transfer
    dietary: string;
    allergies: string; 
    accommodation: boolean;
}
  