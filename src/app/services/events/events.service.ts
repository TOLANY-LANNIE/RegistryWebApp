import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private db: AngularFirestore) { }

  getAllEvents() {
    return new Promise<any>((resolve)=> {
      this.db.collection('Events').valueChanges({ idField: 'id' }).subscribe(events => resolve(events));
    })
  }

  addEvent(event:any){
    
  }

  updateEvent(){

  }

  deleteEvent(){

  }
}
