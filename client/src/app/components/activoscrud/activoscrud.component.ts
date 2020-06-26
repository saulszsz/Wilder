import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute } from '@angular/router';
import { FireService } from '../../services/fire.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

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
  selectedValue: string;
  foods: Food[] = [
    {value: 'activo', viewValue: 'Activo'},
    {value: 'herramienta', viewValue: 'Herramienta'},
    {value: 'otro', viewValue: 'Otro'}
  ];

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
    }),
  );

  constructor(
    private _fs: FireService,
    private _route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.idActivo = this._route.snapshot.paramMap.get('id');
  }

}
