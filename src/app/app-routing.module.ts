import { ContactComponent } from './components/contact/contact.component';
import { AskedComponent } from './components/asked/asked.component';
import { AboutComponent } from './components/about/about.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ActivoslistaComponent } from './components/activoslista/activoslista.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'pendientes', component: CalendarComponent},
  {path: 'about', component: AboutComponent},
  {path: 'asked', component: AskedComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'inventario', component: ActivoslistaComponent},
  {path: '**', component: InicioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
