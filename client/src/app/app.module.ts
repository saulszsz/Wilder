import { FormsService } from './services/forms.service';
import { WindowService } from './services/window.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarComponent } from './components/calendar/calendar.component';
import { MaterialModule } from './modules/material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { environment } from '../environments/environment';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { InicioComponent } from './components/inicio/inicio.component';
import { ListgenComponent } from './listgen/listgen.component';
import { ActivoslistaComponent } from './components/activoslista/activoslista.component';
import { ActivoscrudComponent } from './components/activoscrud/activoscrud.component';
import { AboutComponent } from './components/about/about.component';
import { AskedComponent } from './components/asked/asked.component';
import { ContactComponent } from './components/contact/contact.component';
import { ActivosprewComponent } from './components/activosprew/activosprew.component';
import { HelpComponent } from './components/help/help.component';
import { MyfilesComponent } from './components/myfiles/myfiles.component';
import { HttpClientModule } from '@angular/common/http';
import { Globals } from './services/globals';
import { GraphicsComponent } from './components/graphics/graphics.component';

import { ChartsModule } from 'ng2-charts';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SolicitudesComponent } from './components/solicitudes/solicitudes.component';
<<<<<<< HEAD
import { MantenimientoComponent } from './components/mantenimiento/mantenimiento.component';
=======
import { UsermenuComponent } from './components/usermenu/usermenu.component';
>>>>>>> 38f38afbbe5bac65d2d38cf74db5f013dba9318b

@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    CalendarComponent,
    ListgenComponent,
    ActivoslistaComponent,
    ActivoscrudComponent,
    AboutComponent,
    AskedComponent,
    ContactComponent,
    ActivosprewComponent,
    HelpComponent,
    MyfilesComponent,
    GraphicsComponent,
    SolicitudesComponent,
<<<<<<< HEAD
    MantenimientoComponent
=======
    UsermenuComponent
>>>>>>> 38f38afbbe5bac65d2d38cf74db5f013dba9318b
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    AngularFireDatabaseModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    NgxSpinnerModule
  ],
  providers: [
    Globals,
    CookieService,
    WindowService,
    FormsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
