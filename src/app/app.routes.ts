import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AttendeesListComponent } from './features/attendees-list/attendees-list.component';
import { RegistrationFormComponent } from './features/registration-form/registration-form.component';
import { EventsComponent } from './features/events/events.component';
import { ThankyouComponent } from './features/thankyou/thankyou.component';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { EventsBoardComponent } from './features/events-board/events-board.component';
import { MailGroupsComponent } from './features/mail-groups/mail-groups.component';
import { CalendarComponent } from './features/calendar/calendar.component';
import { LoginComponent } from './features/login/login.component';
import { SignupComponent } from './features/signup/signup.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { SecureInnerPageGuard } from './shared/guard/secure-inner-page.guard';


export const routes: Routes = [
    {
        path: 'invite',
        component: LoginLayoutComponent,
        children: [
        {path: 'registration', component: RegistrationFormComponent},
        { path: 'thank-you', component: ThankyouComponent },
        ]
    },
    {
        path: 'auth',
        component: LoginLayoutComponent,
        children: [
        {path: 'login', component: LoginComponent},
        {path: 'sign-up', component: SignupComponent},
        ]
    },
    {path: 'attendees', component:AttendeesListComponent,canActivate: [AuthGuard] },
    {path: 'events', component:EventsComponent ,canActivate: [AuthGuard] },
    {path: 'groups', component:MailGroupsComponent ,canActivate: [AuthGuard] },
    { path: 'events-board', component: EventsBoardComponent, canActivate: [AuthGuard] },
    { path: 'calendar', component: CalendarComponent, canActivate: [AuthGuard] },
    {path:'', redirectTo:'/auth/login', pathMatch:'full'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports:[RouterModule]
})
export class AppRoutingModule{ }
