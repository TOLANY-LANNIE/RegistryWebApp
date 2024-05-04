export interface Doctor {
    id: number; // Unique identifier for the doctor
    practiseNumber: string; // Practise number of the doctor
    name: string; // Name of the doctor
    surname: string; // Surname of the doctor
    contact: string; // Contact number of the doctor
    email: string; // Email address of the doctor
    flightDetails?: {
      flightDate: string; // Date of the flight (format: 'YYYY-MM-DD')
      flightTime: string; // Time of the flight (format: 'HH:MM')
      connectingFlight: boolean; // Whether the doctor needs a connecting flight
      transferDetails?: string; // Details about the connecting flight or transfer
    };
    dietaryDetails?:{
        dietary: string;
        allergies: string; 
    }
}
  