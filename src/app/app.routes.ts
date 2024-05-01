import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AttendeesListComponent } from './features/attendees-list/attendees-list.component';
import { AttendeesSubmissionComponent } from './features/attendees-submission/attendees-submission.component';

const routes: Routes = [
    {path: 'home', component:AttendeesListComponent},
    {path: 'submission/:id', component: AttendeesSubmissionComponent},
    {path:'', redirectTo:'/home', pathMatch:'full'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports:[RouterModule]
})
export class AppRoutingModule{ }
