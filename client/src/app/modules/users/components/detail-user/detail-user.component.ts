import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { FireService } from './../../../../services/fire.service';
import { Component, OnInit } from '@angular/core';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'app-detail-user',
  templateUrl: './detail-user.component.html',
  styleUrls: ['./detail-user.component.css']
})
export class DetailUserComponent implements OnInit {
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
        this.user_uid = uid;
        return this._fs._fireDb.object('users/' + uid).valueChanges();
      }
    }),
  );
  user_uid: any;

  prestamos: any;
  prestamos_terminados: any;

  constructor(
    private _fs: FireService,
    private _router: Router,
    private _snack: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getPrestamos();
  }

  getPrestamos() {
    var that = this;
    this.user.subscribe(
      (user: any) => {
        this._fs.getPrestamos(that.user_uid).subscribe(
          (result) => {
            var list = [];
            var list_terminado = [];
            for (let pres in result) {
              result[pres]['activo_desc'] = that._fs._fireDb.object('inventario/' + result[pres]['activo']).valueChanges();
              result[pres]['id'] = pres;
              if(!result[pres]['entregado']){
                list.push(result[pres]);
              } else {
                list_terminado.push(result[pres]);
              }
            }
            that.prestamos = list;
            that.prestamos_terminados = list_terminado;
          },
          (error) => {
            console.log(error);
            this._snack.open("Error! " + JSON.stringify(error), 'OK', {
              duration: 8000,
              verticalPosition: 'bottom'
            });
            that.prestamos = false;
          }
        );
      },
      (error) => {
        this._snack.open("Error! " + JSON.stringify(error), 'OK', {
          duration: 8000,
          verticalPosition: 'bottom'
        });
        that.prestamos = false;
      }
    );
  }

  regresarActivo(id: string, id_activo: string) {
    this._fs.regresarActivo(id, id_activo).subscribe(
      (success) => {
        this._snack.open("Artículo devuelto a inventario.", 'OK', {
          duration: 8000,
          verticalPosition: 'bottom'
        });
        this._router.navigate(['/']);
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
