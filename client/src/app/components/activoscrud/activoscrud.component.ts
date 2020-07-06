import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FireService } from '../../services/fire.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { PercentPipe, DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-activoscrud',
  templateUrl: './activoscrud.component.html',
  styleUrls: ['./activoscrud.component.css'],
  providers: [DatePipe]
})
export class ActivoscrudComponent implements OnInit {
  todoForm: FormGroup;

  qrDefault: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAATVSURBVO3BQW4kSRIEQdNA/f/Lujz6KYBEehGcXhPBH6laclK16KRq0UnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC365CUgv0nNE0Bu1ExAnlAzAXlDzQTkN6l546Rq0UnVopOqRZ8sU7MJyBNAJjU3QN4A8oSaCcgTajYB2XRSteikatFJ1aJPvgzIE2qeADKpmYBMap5QMwGZ1DwBZBOQJ9R800nVopOqRSdViz75PwPkRs0E5Akgk5obNf+Sk6pFJ1WLTqoWffKPAXKj5gk1E5AJyKTmCSCTmv+yk6pFJ1WLTqoWffJlan6Tmm9S84aaTWr+kpOqRSdVi06qFn2yDMhfAmRSMwGZ1ExAJjUTkEnNBGRSMwGZ1NwA+ctOqhadVC06qVr0yUtq/hIgk5oJyKTmm9RMQCY1N2r+S06qFp1ULTqpWoQ/8gKQSc0EZJOaGyCTmm8CcqPmBsikZgKySc03nVQtOqladFK1CH/kBSA3aiYgT6iZgPwlam6A/CY1TwCZ1LxxUrXopGrRSdWiT15SMwG5UfMEkEnNG0AmNROQJ4BMam7UTEAmNU8AeUPNppOqRSdVi06qFn3yEpBJzQ2QSc0EZFIzAblRMwF5Q80EZFJzo2YTkBsgk5oJyKRm00nVopOqRSdVi/BHFgG5UXMD5Ak1N0Bu1NwAuVEzAZnU/CYgN2q+6aRq0UnVopOqRfgjLwCZ1ExAbtRMQCY1E5AbNROQSc0EZFJzA+RGzQ2QGzUTkCfUPAFkUvPGSdWik6pFJ1WL8EdeAHKjZgJyo2YCsknNBGRSswnIpOYGyKTmBsgTar7ppGrRSdWik6pFnyxT84SaGzU3QCY1E5AJyBNAJjUTkEnNJiA3ap4AMqnZdFK16KRq0UnVIvyRRUAmNTdAJjUTkBs1E5A31LwBZFIzAZnUbAJyo+abTqoWnVQtOqla9MlLQDYBmdRMQCYgk5obIJOaCcgTaiY1TwDZpGYCcgNkUvPGSdWik6pFJ1WLPlmm5gk1N0CeADKpuQHyBpBJzQRkUnMD5Dep2XRSteikatFJ1aJPvgzIpGYCMqmZ1ExAbtTcqJmA3Ki5AfIEkBs1m9RMQCY1m06qFp1ULTqpWvTJHwdkUjMBeQLIpOYGyKRmUjMBeQPIG2omIDdAJjVvnFQtOqladFK1CH/kPwzIE2omIJOaN4DcqJmATGqeALJJzRsnVYtOqhadVC365CUgv0nNpGYCcgNkUvMEkCfUTECeADKpeUPNN51ULTqpWnRSteiTZWo2AbkBcqNmAjIBmdRMQJ5QMwGZ1ExAbtQ8oeYGyKRm00nVopOqRSdViz75MiBPqHlDzSY1TwCZ1DwBZBOQ33RSteikatFJ1aJP/nFAngByo2YCMqmZgExqbtS8AeQJIJOaN06qFp1ULTqpWvTJPwbIjZo3gNwAuQEyqZmA/CY1m06qFp1ULTqpWvTJl6n5JjU3QDapmYBMam6ATEAmNROQGzUTkEnNBOSbTqoWnVQtOqlahD/yApDfpGYCMqm5ATKp2QRkUjMBmdRMQL5JzTedVC06qVp0UrUIf6RqyUnVopOqRSdVi06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVp0UrXof8lAPDyW7HP5AAAAAElFTkSuQmCC";
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
        return of(false);
      } else {
        return this._fs._fireDb.object('users/' + uid).valueChanges();
      }
    })
  );
  datosActivo: any = {
    qr: this.qrDefault,
    nombre: "",
    modelo: "",
    categoria: "",
    descripcion: "",
    dominio: "Bodega",
    trabajo: "",
    fecha: new Date()
  };
  idActivo: string;
  foods: Food[] = [
    { value: 'activo', viewValue: 'Activo' },
    { value: 'herramienta', viewValue: 'Herramienta' },
    { value: 'otro', viewValue: 'Otro' }
  ];

  constructor(
    private _fs: FireService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _snack: MatSnackBar,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.idActivo = this._route.snapshot.paramMap.get('id');
    if (this.idActivo != "0") {
      this.obtenerActivo();
    }

    this.todoForm = this.formBuilder.group({
      v_nombre: ['', Validators.required],
      v_modelo: ['', Validators.required],
      v_categoria: ['', Validators.required],
      v_descripcion: ['', Validators.required]
    });
  }

  registrarActivo(evt: any, trabajo: string) {
    evt.preventDefault();
    this.datosActivo.trabajo = trabajo;
    this._fs.createActivo(this.datosActivo).subscribe(
      (result: any) => {
        if (result.creado)
          this._snack.open("Se registró con éxito", 'OK', {
            duration: 8000,
            verticalPosition: 'bottom'
          });
        else
          this._snack.open("No se registró con éxito", 'OK', {
            duration: 8000,
            verticalPosition: 'bottom'
          });
        this._router.navigate(['/inventario']);
      },
      (error: any) => {
        this._snack.open("Error!!! " + JSON.stringify(error), 'OK', {
          duration: 8000,
          verticalPosition: 'bottom'
        });
      }
    );
  }

  obtenerActivo() {
    let payload = {
      uid: this.idActivo
    }
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
            this.datosActivo = JSON.parse(result);
          }
        } else {
          this._snack.open("Activo no encontrado.", 'OK', {
            duration: 8000,
            verticalPosition: 'bottom'
          });
          this._router.navigate(['/inventario']);
        }
      },
      (error: any) => {
        alert("Error! " + JSON.stringify(error));
      }
    );
  }

  editarActivo(evt: any, trabajo: string) {
    evt.preventDefault();
    this.datosActivo.trabajo = trabajo;
    this._fs.editActivo(this.datosActivo, this.idActivo).subscribe(
      (result: any) => {
        if (result.creado)
          this._snack.open("Se edito con éxito", 'OK', {
            duration: 8000,
            verticalPosition: 'bottom'
          });
        else
          this._snack.open("No se edito con éxito", 'OK', {
            duration: 8000,
            verticalPosition: 'bottom'
          });
        this._router.navigate(['/inventario']);
      },
      (error: any) => {
        this._snack.open("Error!!! " + JSON.stringify(error), 'OK', {
          duration: 8000,
          verticalPosition: 'bottom'
        });
      }
    );
  }

  eliminarActivo(evt: any) {
    evt.preventDefault();
    this._fs.deletActivo(this.idActivo).subscribe(
      (result: any) => {
        if (result.creado)
          this._snack.open("Se elimino con éxito", 'OK', {
            duration: 8000,
            verticalPosition: 'bottom'
          });
        else
          this._snack.open("No se elimino con éxito", 'OK', {
            duration: 8000,
            verticalPosition: 'bottom'
          });
        this._router.navigate(['/inventario']);
      },
      (error: any) => {
        this._snack.open("Error!!! " + JSON.stringify(error), 'OK', {
          duration: 8000,
          verticalPosition: 'bottom'
        });
      }
    );
  }

  listaEspera(uid: string, trabajo: string) {
    this._fs.solicitarActivo(this.idActivo, uid, trabajo).subscribe(
      (result: any) => {
        if (result.exito)
          this._snack.open("Cuando la solicitud sea aprobada te indicaremos aquí.", 'OK', {
            duration: 8000,
            verticalPosition: 'bottom'
          });
        else
          this._snack.open("Error interno, contacta al administrador.", 'OK', {
            duration: 8000,
            verticalPosition: 'bottom'
          });
        this._router.navigate(['/inventario']);
      },
      (error: any) => {
        this._snack.open("Error!!! " + JSON.stringify(error), 'OK', {
          duration: 8000,
          verticalPosition: 'bottom'
        });
      }
    );
  }
}
