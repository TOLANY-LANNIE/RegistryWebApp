
import { AppRoutingModule,routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule, provideRouter, withComponentInputBinding, withInMemoryScrolling, withViewTransitions} from '@angular/router';
import { NgModule } from '@angular/core';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { GlobalInterceptor } from './interceptors/http.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { AddGroupComponent } from './modals/add-group/add-group.component';
import { LoggerModule} from "ngx-logger";
import { FormsModule} from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';

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
import { NumberRestricDirective } from './utils/utils';
import { ThankyouComponent } from './features/thankyou/thankyou.component';
import { LoginLayoutComponent } from './layout/login-layout/login-layout.component';
import { EventDetailsComponent } from './modals/event-details/event-details.component';
import { AttendeeDetailsComponent } from './modals/attendee-details/attendee-details.component';
import { EventCardComponent } from './features/event-card/event-card.component';
import { SendInviteComponent } from './modals/send-invite/send-invite.component';
import {DeleteGuestComponent} from  './modals/delete-guest/delete-guest.component';
import { EventsBoardComponent } from './features/events-board/events-board.component';
import { PhoneNumberFormatterDirective } from './utils/phoneNumber-directive';
import { MailGroupsComponent } from './features/mail-groups/mail-groups.component';
import { ToastService } from './services/toast.service';
import { AddRecipientComponent } from './modals/add-recipient/add-recipient.component';
import { DeleteRecipientComponent } from './modals/delete-recipient/delete-recipient.component';
import { EditRecipientComponent } from './modals/edit-recipient/edit-recipient.component';
import { NotificationCardComponent} from './features/notification-card/notification-card.component';
import { CalendarComponent } from './features/calendar/calendar.component';
import { LoginComponent } from './features/login/login.component';
import { SignupComponent } from './features/signup/signup.component';
import { AuthGuard } from './shared/guard/auth.guard';

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
import {MatProgressBarModule} from '@angular/material/progress-bar'; 
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { TooltipModule } from 'primeng/tooltip';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuModule } from 'primeng/menu';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { SplitterModule } from 'primeng/splitter';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { OverlayPanelModule } from 'primeng/overlaypanel';

import { FullCalendarModule} from '@fullcalendar/angular'

import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { environment } from '../environment/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { ForgotPasswordComponent } from './features/forgot-password/forgot-password.component';


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
    NumberRestricDirective,
    ThankyouComponent,
    LoginLayoutComponent,
    EventDetailsComponent,
    AttendeeDetailsComponent,
    DeleteGuestComponent,
    EventCardComponent,
    EventsBoardComponent,
    PhoneNumberFormatterDirective,
    MailGroupsComponent,
    AddGroupComponent,
    AddRecipientComponent,
    DeleteRecipientComponent,
    EditRecipientComponent ,
    NotificationCardComponent,
    CalendarComponent ,
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent
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
    CommonModule,
    TimeagoModule.forRoot(),

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
    MatProgressBarModule,
    MatTooltipModule,
    MatChipsModule,
    MatAutocompleteModule,

    TooltipModule,
    AvatarModule,
    AvatarGroupModule,
    BreadcrumbModule,
    MenuModule,
    ToastModule,
    SplitterModule,
    ButtonModule,
    FileUploadModule,
    OverlayPanelModule,
    
    FullCalendarModule,

    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
  ],
  providers:[
    provideRouter(
      routes,
      withViewTransitions(),
      withComponentInputBinding(),
      withInMemoryScrolling({scrollPositionRestoration: 'enabled'}),
    ),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: GlobalInterceptor,
      multi: true,
   }, 
   provideAnimationsAsync(),
   provideAnimations(),
   ToastService,
   MessageService,
   AuthGuard
  ],
  bootstrap:[AppComponent]
})

export class AppModule{}
