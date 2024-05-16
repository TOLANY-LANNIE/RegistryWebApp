import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AttendeesListComponent } from './features/attendees-list/attendees-list.component';
import { RegistrationFormComponent } from './features/registration-form/registration-form.component';
import { EventsComponent } from './features/events/events.component';
import { ThankyouComponent } from './features/thankyou/thankyou.component';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { EventsBoardComponent } from './features/events-board/events-board.component';
const routes: Routes = [
    {
        path: 'invite',
        component: LoginLayoutComponent,
        children: [
        {path: 'registration', component: RegistrationFormComponent},
        { path: 'thank-you', component: ThankyouComponent },
        { path: 'events-board', component: EventsBoardComponent },
        ]
    },
    {path: 'attendees', component:AttendeesListComponent},
    {path: 'events', component:EventsComponent},
    {path:'', redirectTo:'/invite/events-board', pathMatch:'full'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports:[RouterModule]
})
export class AppRoutingModule{ }
