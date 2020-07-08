import { FormsService } from './../../services/forms.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { FireService } from './../../services/fire.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-mantenimiento',
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css']
})
export class MantenimientoComponent implements OnInit {
  idActivo: string
  activo: any

  formulario: FormGroup;

  uid = this._fs._afAuth.authState.pipe(
    map(authState => {
      if (!authState) {
        return '';
      } else {
        return authState.uid;
      }
    })
  );

  uid_string: string;

  user: any = this.uid.pipe(
    switchMap(uid => {
      if (!uid) {
        this._router.navigate(['/']);
      } else {
        return this._fs._fireDb.object('users/' + uid).valueChanges();
      }
    }),
  );

  constructor(
    private _fs: FireService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _snack: MatSnackBar,
    public _form: FormsService,
    private _fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.idActivo = this._route.snapshot.paramMap.get('id');
    if (!this.idActivo) {
      this._snack.open("Asegúrate de introducir correctamente la URL.", 'OK', {
        duration: 8000,
        verticalPosition: 'bottom'
      });
      this._router.navigate(['/activo/' + this.idActivo]);
    }
    this.getActivo({ uid: this.idActivo });
    this.formulario = this._fb.group({
      'fecha': ['',
        [
          Validators.required,
        ]
      ],
      'folio': ['',
        [
          Validators.required,
        ]
      ],
      'costo': ['',
        [
          Validators.required,
        ]
      ],
      'descripcion': ['',
        [
          Validators.required,
          Validators.minLength(10)
        ]
      ]
    })
  }

  getActivo(payload: any) {
    this._fs.getActivo(payload).subscribe(
      (result: any) => {
        if (result) {
          if (result == "null") {
            this._snack.open("Activo no encontrado.", 'OK', {
              duration: 8000,
              verticalPosition: 'bottom'
            });
            this._router.navigate(['/inventario']);
          } else {
            this.activo = JSON.parse(result);
            console.log(this.activo);
          }
        } else {
          this._snack.open("Activo no encontrado.", 'OK', {
            duration: 8000,
            verticalPosition: 'bottom'
          });
          this._router.navigate(['/activo/' + this.idActivo]);
        }
      },
      (error: any) => {
        this._snack.open("Error! " + JSON.stringify(error), 'OK', {
          duration: 8000,
          verticalPosition: 'bottom'
        });
      }
    );
  }

  envio(evt: any, uid: string) {
    if (!this.formulario.valid) {
      this._snack.open('¡Tu formulario no está en condiciones de ser enviado!', 'OK', {
        duration: 5000,
        verticalPosition: 'top'
      });
      return;
    }
    var that = this;
    // fecha, folio, costo, descripcion, id usuario, id compañia, id activo
    var payload = {
      fecha: this.formulario.get('fecha').value,
      folio: this.formulario.get('folio').value,
      costo: this.formulario.get('costo').value,
      descripcion: this.formulario.get('descripcion').value,
      id_usuario: uid,
      id_trabajo: this.activo.trabajo,
      id_activo: this.idActivo
    };

    this._fs.createMantenimiento(payload).subscribe(
      (response: any) => {
        if (response.exito) {
          this._snack.open('El mantenimiento se ha registrado de manera exitosa.', 'OK', {
            duration: 5000,
            verticalPosition: 'top'
          });
          this._router.navigate(['/activo' + this.idActivo]);
        }
      },
      (error) => {
        this._snack.open('Hubo un error, contacta a tu administrador.', 'OK', {
          duration: 5000,
          verticalPosition: 'top'
        });
      }
    )
  }
}
