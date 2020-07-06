import { FormsService } from './../../services/forms.service';
import { Router } from '@angular/router';
import { FireService } from './../../services/fire.service';
import { Component, OnInit } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent implements OnInit {
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

  constructor(
    private _fs: FireService,
    private _router: Router,
    private _fb: FormBuilder,
    public _form: FormsService
  ) { }

  ngOnInit(): void {
    this.getSolicitudes();
    for (let i = 0; i < this.solicitudes.length; i++) {
      this.solicitudes[i]
    }
  }

  getSolicitudes() {
    var that = this;
    this.user.subscribe(
      (user: any) => {
        this._fs.getSolicitudes(user.trabajo).subscribe(
          (result) => {
            var list = [];
            for (let sol in result) {
              result[sol]['activo'] = that._fs._fireDb.object('inventario/' + result[sol]['id']).valueChanges();
              result[sol]['usuario'] = that._fs._fireDb.object('users/' + result[sol]['id_usuario']).valueChanges();
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
              list.push(result[sol]);
            }
            that.solicitudes = list;
          },
          (error) => {
            alert("Cambiar por snack, error!");
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

  enviarPrestamo(event, index: number, id_activo: string, id_usuario: string) {
    var payload = {
      fecha: this.formulario[index].get("fecha").value(),
      observaciones: this.formulario[index].get("observaciones").value(),
      usuario: id_usuario,
      activo: id_activo,
      fecha_entregado: null
    }
  }

}
