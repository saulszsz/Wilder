import { CalendarComponent } from './components/calendar/calendar.component';
import { MaterialModule } from './modules/material/material.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
    ActivosprewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
