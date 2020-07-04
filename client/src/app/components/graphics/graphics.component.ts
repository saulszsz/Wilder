import { Component, OnInit } from '@angular/core';
import { FireService } from '../../services/fire.service';
import { Router } from '@angular/router';
import { map, startWith, switchMap } from 'rxjs/operators';

import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.css']
})
export class GraphicsComponent implements OnInit {
  bandera:boolean;

  public doughnutChartLabels = ['Activo', 'Herramienta', 'Otro'];
  public doughnutChartData = [120, 150, 180];
  public doughnutChartType = 'doughnut';

  //Cosas Añadidas
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
  uid = this._fs._afAuth.authState.pipe(
    map(authState => {
      if (!authState) {
        return '';
      } else {
        return authState.uid;
      }
    })
  );
  user: any = this.uid.pipe(
    switchMap(uid => {
      if (!uid) {
        this._router.navigate(['/']);
      } else {
        return this._fs._fireDb.object('users/' + uid).valueChanges();
      }
    }),
  );

  constructor(private _fs: FireService, private _router: Router,private spinnerService: NgxSpinnerService) { }
    
  activos = [];
  activos_etq = [];
  activos_numero = [];

  ngOnInit(): void {
    this.bandera=true;
    this.spinner();
    this._fs.getActivos().subscribe(
      (result) => {
        if (result) {
          var array = [];
          for (let i in result) {
            array.push(result[i]);
            array[array.length - 1]['id'] = i;
          }
        }
        array.forEach((dato) => {
          this.activos.push(dato);
        });
        for(let i = 0; i < this.activos.length; i++) {
          if(!this.activos_etq.includes(this.activos[i].categoria)){
            this.activos_etq.push(this.activos[i].categoria);
            this.activos_numero.push(0);
          }
          this.activos_numero[this.activos_etq.indexOf(this.activos[i].categoria)] ++;
        }
        console.log(this.activos_numero);
        console.log(this.activos_etq);
        this.doughnutChartLabels = this.activos_etq;
        this.doughnutChartData = this.activos_numero;
        this.bandera=false;
        this.spinner();
      },
      (error) => {
        return [];
      }
    );

  }

  spinner(): void{
    if(this.bandera){
      this.spinnerService.show();
    }else if(!this.bandera){
      this.spinnerService.hide();
    }
  }

}
