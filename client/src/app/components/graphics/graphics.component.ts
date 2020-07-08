import { MatSnackBar } from '@angular/material/snack-bar';
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
  bandera: boolean;

  public doughnutChartLabels = ['Activo', 'Herramienta', 'Otro'];
  public doughnutChartData = [120, 150, 180];
  public doughnutChartType = 'doughnut';

  /*public steppedChartLabels = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  public steppedChartData = [];
  public steppedChartType = 'stepped';*/

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(153, 102, 255, 0.2)'
    ]
  };
  public barChartLabels = ['Enero-2020', 'Febrero-2020', 'Marzo-2020', 'Abril-2020', 'Mayo-2020', 'Junio-2020', 'Julio-2020', 'Agosto-2020', 'Septiembre-2020', 'Octubre-2020', 'Noviembre-2020', 'Diciembre-2020'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData = [];

  public pieChartLabels = ['Sales Q1', 'Sales Q2', 'Sales Q3', 'Sales Q4'];
  public pieChartData = [120, 150, 180, 90];
  public pieChartType = 'pie';

  /*public steppedChartLabels = ['Enero-2020','Febrero-2020','Marzo-2020','Abril-2020','Mayo-2020','Junio-2020','Julio-2020','Agosto-2020','Septiembre-2020','Octubre-2020','Noviembre-2020','Diciembre-2020'];
  public steppedChartType = 'line';
  public steppedChartLegend = true;
  public steppedChartData = [];*/

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

  constructor(private _fs: FireService, private _router: Router, private spinnerService: NgxSpinnerService, private _snack: MatSnackBar) { }

  activos = [];
  activos_etq = [];
  activos_numero = [];
  activos_fechas = [];
  activos_mes_aux: string;
  activos_dominio = [];
  actibos_dom_numero = [];

  ngOnInit(): void {
    this.bandera = true;
    this.spinner();
    this.user.subscribe(
      (user: any) => {
        this._fs.getActivos(user['trabajo']).subscribe(
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
            for (let i = 0; i < this.activos.length; i++) {
              if (!this.activos_etq.includes(this.activos[i].categoria)) {
                this.activos_etq.push(this.activos[i].categoria);
                this.activos_numero.push(0);
              }
              this.activos_numero[this.activos_etq.indexOf(this.activos[i].categoria)]++;

              if (!this.activos_dominio.includes(this.activos[i].dominio)) {
                this.activos_dominio.push(this.activos[i].dominio);
                this.actibos_dom_numero.push(0);
              }
              this.actibos_dom_numero[this.activos_dominio.indexOf(this.activos[i].dominio)]++;

              this.activos_mes_aux = this.activos[i].fecha[5];
              this.activos_mes_aux += this.activos[i].fecha[6];

              if (i == 0) {
                console.log("Entro");
                for (let j = 0; j < 12; j++) {
                  this.activos_fechas[j] = 0;
                }
              }

              if (this.activos_mes_aux == "01") {
                this.activos_fechas[0] += 1;
              } else if (this.activos_mes_aux == "02") {
                this.activos_fechas[1] += 1;
              } else if (this.activos_mes_aux == "03") {
                this.activos_fechas[2] += 1;
              } else if (this.activos_mes_aux == "04") {
                this.activos_fechas[3] += 1;
              } else if (this.activos_mes_aux == "05") {
                this.activos_fechas[4] += 1;
              } else if (this.activos_mes_aux == "06") {
                this.activos_fechas[5] += 1;
              } else if (this.activos_mes_aux == "07") {
                this.activos_fechas[6] += 1;
              } else if (this.activos_mes_aux == "08") {
                this.activos_fechas[7] += 1;
              } else if (this.activos_mes_aux == "09") {
                this.activos_fechas[8] += 1;
              } else if (this.activos_mes_aux == "10") {
                this.activos_fechas[9] += 1;
              } else if (this.activos_mes_aux == "11") {
                this.activos_fechas[10] += 1;
              } else if (this.activos_mes_aux == "12") {
                this.activos_fechas[11] += 1;
              }


            }
            console.log(this.activos[0].fecha[5]);
            console.log(this.activos[0].fecha[6]);
            console.log(this.activos_mes_aux);
            console.log(this.activos_fechas);
            console.log(this.activos_numero);
            console.log(this.activos_etq);
            this.doughnutChartLabels = this.activos_etq;
            this.doughnutChartData = this.activos_numero;

            /* this.steppedChartLabels =['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
             this.steppedChartData = [1,2,3,4,5,6,7,8,9,10,11,12];*/
            this.barChartData = [
              { data: this.activos_fechas, label: 'Por Mes' },
            ];
            //this.steppedChartData=[this.activos_fechas];

            this.pieChartLabels = this.activos_dominio;
            this.pieChartData = this.actibos_dom_numero;

            this.bandera = false;
            this.spinner();
          },
          (error) => {
            return [];
          }
        );
      },
      (error) => {
        this._snack.open("Error! " + JSON.stringify(error), 'OK', {
          duration: 8000,
          verticalPosition: 'bottom'
        });
      }
    );
  }

  spinner(): void {
    if (this.bandera) {
      this.spinnerService.show();
    } else if (!this.bandera) {
      this.spinnerService.hide();
    }
  }

}
