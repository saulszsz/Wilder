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
        return this._fs._fireDb.object('users/' + uid).valueChanges();
      }
    }),
  );

  company: Observable<any> = this.user.subscribe(
    (data) => {
      return this._fs._fireDb.object('companies/' + data.trabajo).valueChanges();
    },
    (error) => {
      of(false);
    }
  );

  

  constructor(
    private _fs: FireService,
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

}
