import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsService } from './../../services/forms.service';
import { Router } from '@angular/router';
import { FireService } from './../../services/fire.service';
import { Component, OnInit } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {
  today: Date = new Date(Date.now())
  today_str: string = this.today.getFullYear() + '-' +
    (this.today.getMonth() + 1 < 10 ? '0' + (this.today.getMonth() + 1) : (this.today.getMonth() + 1).toString()) + '-' +
    (this.today.getDate() ? '0' + this.today.getDate() : this.today.getDate().toString());

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

  formulario: Array<FormGroup> = [];

  solicitudes: any;
  solicitudes_abiertas: any;

  constructor(
    private _fs: FireService,
    private _router: Router,
    private _fb: FormBuilder,
    public _form: FormsService,
    private _snack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getSolicitudes();
  }

  getSolicitudes() {
    var that = this;
    this.user.subscribe(
      (user: any) => {
        if (user.tipo != 'admin') {
          this._router.navigate(['/inventario']);
        }
        this._fs.getSolicitudes(user.trabajo).subscribe(
          (result) => {
            var list = [];
            var list_cerrado = [];
            for (let sol in result) {
              result[sol]['activo'] = that._fs._fireDb.object('inventario/' + result[sol]['id']).valueChanges();
              result[sol]['usuario'] = that._fs._fireDb.object('users/' + result[sol]['id_usuario']).valueChanges();
              result[sol]['id_sol'] = sol;
              that.formulario.push(
                this._fb.group({
                  'fecha': ['',
                    [
                      Validators.required,
                    ]
                  ],
                  'observaciones': ['',
                    [
                      Validators.required,
                      Validators.minLength(10)
                    ]
                  ]
                })
              )
              result[sol]['abierto'] ? list.push(result[sol]) : list_cerrado.push(result[sol]);
            }
            that.solicitudes = list_cerrado;
            that.solicitudes_abiertas = list;
          },
          (error) => {
            this._snack.open("Error! " + JSON.stringify(error), 'OK', {
              duration: 8000,
              verticalPosition: 'bottom'
            });
            that.solicitudes = false;
          }
        );
      },
      (error) => {
        console.log("error interno" + error);
        that.solicitudes = false;
      }
    );
  }

  noPrestar(id_solicitud: string, id_activo: string) {
    this._fs.eliminarSolicitud(id_solicitud, id_activo).subscribe(
      (response: any) => {
        if (response.exito) {
          this._snack.open("Se eliminó la solicitud de manera exitosa.", 'OK', {
            duration: 8000,
            verticalPosition: 'bottom'
          });
          this._router.navigate(['/inventario']);
        }
      },
      (error) => {
        this._snack.open("Error! " + JSON.stringify(error), 'OK', {
          duration: 8000,
          verticalPosition: 'bottom'
        });
      }
    )
  }

  enviarPrestamo(event, index: number, id_activo: string, id_usuario: string) {
    var payload = {
      fecha_estimada_regreso: this.formulario[index].get("fecha").value,
      fecha: new Date(Date.now()),
      observaciones: this.formulario[index].get("observaciones").value,
      usuario: id_usuario,
      activo: id_activo,
      entregado: false,
      fecha_entregado: null
    }

    this._fs.createPrestamo(payload).subscribe(
      (response: any) => {
        if (response.exito) {
          this._snack.open("Se ha autorizado el préstamo", 'OK', {
            duration: 8000,
            verticalPosition: 'bottom'
          });
          this._router.navigate(['/inventario']);
        }
      },
      (error) => {
        this._snack.open("Error! " + JSON.stringify(error), 'OK', {
          duration: 8000,
          verticalPosition: 'bottom'
        });
      }
    )
  }

}
