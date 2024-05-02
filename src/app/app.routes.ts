import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AttendeesListComponent } from './features/attendees-list/attendees-list.component';
import { RegistrationFormComponent } from './features/registration-form/registration-form.component';
const routes: Routes = [
    {path: 'home', component:AttendeesListComponent},
    {path: 'registration/:id', component: RegistrationFormComponent},
    {path:'', redirectTo:'/home', pathMatch:'full'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports:[RouterModule]
})
export class AppRoutingModule{ }
