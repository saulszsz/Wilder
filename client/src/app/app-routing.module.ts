import { UsersModule } from './modules/users/users.module';
import { ContactComponent } from './components/contact/contact.component';
import { AskedComponent } from './components/asked/asked.component';
import { AboutComponent } from './components/about/about.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ActivoslistaComponent } from './components/activoslista/activoslista.component';
import { ActivoscrudComponent } from './components/activoscrud/activoscrud.component';
import { HelpComponent } from './components/help/help.component';
import { MyfilesComponent } from './components/myfiles/myfiles.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', component: InicioComponent },
  {
    path: 'users',
    loadChildren: () => UsersModule,
  },
  { path: 'pendientes', component: CalendarComponent },
  { path: 'about', component: AboutComponent },
  { path: 'asked', component: AskedComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'inventario', component: ActivoslistaComponent },
  { path: 'activo', component: ActivoscrudComponent },
  { path: 'ayuda', component: HelpComponent },
  { path: 'archivos', component: MyfilesComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
