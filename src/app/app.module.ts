
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

import { AppComponent } from './app.component';
import { AttendeesListComponent } from './features/attendees-list/attendees-list.component';
import { LoaderComponent } from './features/loader/loader.component';
import { SideMenuComponent } from './shared/side-menu/side-menu.component';
import { RegistrationFormComponent } from './features/registration-form/registration-form.component';
import { EventsComponent } from './features/events/events.component';

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


import { MatPaginatorModule} from '@angular/material/paginator';
import { MatDialogModule} from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort'

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
    EventsComponent
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
