
import { AppRoutingModule } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule} from '@angular/router';
import { NgModule } from '@angular/core';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { GlobalInterceptor } from './interceptors/http.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { LoggerModule} from "ngx-logger";
import { FormsModule} from '@angular/forms';
import { SendInviteComponent } from './modals/send-invite/send-invite.component';
import {DeleteGuestComponent} from  './modals/delete-guest/delete-guest.component';
import { EventsBoardComponent } from './features/events-board/events-board.component';

import { AppComponent } from './app.component';
import { AttendeesListComponent } from './features/attendees-list/attendees-list.component';
import { LoaderComponent } from './features/loader/loader.component';
import { SideMenuComponent } from './shared/side-menu/side-menu.component';
import { RegistrationFormComponent } from './features/registration-form/registration-form.component';
import { EventsComponent } from './features/events/events.component';
import { AddEventComponent } from './modals/add-event/add-event.component';
import { EditAttendeeComponent } from './modals/edit-attendee/edit-attendee.component';
import { EditEventComponent } from './modals/edit-event/edit-event.component';
import { DeleteAlertComponent } from './modals/delete-alert/delete-alert.component';
import { BreadcrumbsComponent } from './features/breadcrumbs/breadcrumbs.component';
import { NumberRestricDirective } from './utils/utils';
import { ThankyouComponent } from './features/thankyou/thankyou.component';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { EventDetailsComponent } from './modals/event-details/event-details.component';
import { AttendeeDetailsComponent } from './modals/attendee-details/attendee-details.component';
import { EventCardComponent } from './features/event-card/event-card.component';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatIconModule} from '@angular/material/icon';
import { MatButtonModule} from '@angular/material/button';
import { MatListModule} from '@angular/material/list';
import { FlexLayoutModule} from "@angular/flex-layout";
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule} from '@angular/material/badge';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatCardModule} from '@angular/material/card';
import { MatTableModule} from '@angular/material/table';
import { MatGridListModule} from '@angular/material/grid-list';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatDialogModule} from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort'
import { MatNativeDateModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';

import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { environment } from '../environment/environment.prod';


@NgModule({
  declarations:[
    AppComponent,
    AttendeesListComponent,
    LoaderComponent,
    SideMenuComponent,
    RegistrationFormComponent,
    EventsComponent,
    AddEventComponent,
    SendInviteComponent,
    EditEventComponent,
    DeleteAlertComponent,
    BreadcrumbsComponent,
    NumberRestricDirective,
    ThankyouComponent,
    LoginLayoutComponent,
    EventDetailsComponent,
    AttendeeDetailsComponent,
    DeleteGuestComponent,
    EventCardComponent,
    EventsBoardComponent
  ],
  imports:[
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule, 
    RouterModule,
    HttpClientModule,
    ReactiveFormsModule,
    LoggerModule,
    FormsModule,
    FlexLayoutModule,

    MatProgressSpinnerModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatBadgeModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatTableModule,
    MatGridListModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSortModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
  ],
  providers:[
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalInterceptor,
      multi: true,
   }, 
   provideAnimationsAsync(),
  ],
  bootstrap:[AppComponent]
})

export class AppModule{}
