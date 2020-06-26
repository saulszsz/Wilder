import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { FireService } from '../../services/fire.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { PercentPipe } from '@angular/common';

interface Food {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-activoscrud',
  templateUrl: './activoscrud.component.html',
  styleUrls: ['./activoscrud.component.css']
})
export class ActivoscrudComponent implements OnInit {
  idActivo: string;
  nombre: string;
  modelo: string;
  selectedValue: string;
  foods: Food[] = [
    {value: 'activo', viewValue: 'Activo'},
    {value: 'herramienta', viewValue: 'Herramienta'},
    {value: 'otro', viewValue: 'Otro'}
  ];
  descripcion: string;

  uid = this._fs._afAuth.authState.pipe(
    map(authState => {
      if (!authState) {
        return '';
      } else {
        return authState.uid;
      }
    })
  );
  user = this.uid.pipe(
    switchMap(uid => {
      if (!uid) {
        return of(false);
      } else {
        return this._fs.getUser(uid);
      }
    }),
  );

  constructor(
    private _fs: FireService,
    private _route: ActivatedRoute,
    private _router: Router
    ) { }

  ngOnInit(): void {
    this.idActivo = this._route.snapshot.paramMap.get('id');
  }

  registrarActivo(evt) {
    evt.preventDefault();
    let payload = {
      nombre: this.nombre,
      modelo: this.modelo,
      categoria: this.selectedValue,
      descripcion: this.descripcion,
      /*fecha: this.fecha,
      qr: this.birthday*/
    }
    this._fs.createActivo(payload).subscribe(
      (result: any) => {
        if (result.creado)
          alert("Se registro con exito.");
        else
          alert("no creado!");
        this._router.navigate(['/inventario']);
      },
      (error: any) => {
        alert("Error!!! "+JSON.stringify(error));
      }
    );
  }
}
