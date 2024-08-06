export interface Notification {
    id?: string; // Optional if Firestore generates it
    Date: any,
    Message:string,
    Hide:boolean,
    Read:boolean,
    User:string
  }
  