import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AttendeesListComponent } from './features/attendees-list/attendees-list.component';
import { RegistrationFormComponent } from './features/registration-form/registration-form.component';
import { EventsComponent } from './features/events/events.component';
import { ThankyouComponent } from './features/thankyou/thankyou.component';

const routes: Routes = [
    {path: 'attendees', component:AttendeesListComponent},
    {path: 'events', component:EventsComponent},
    {path: 'registration', component: RegistrationFormComponent},
    { path: 'thank-you', component: ThankyouComponent },
    {path:'', redirectTo:'/events', pathMatch:'full'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports:[RouterModule]
})
export class AppRoutingModule{ }
