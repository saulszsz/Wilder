import { Component, OnInit } from '@angular/core';
import { FireService } from './services/fire.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Globals } from './services/globals';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  speakValidation: Globals;
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
    private globals: Globals
  ) {
    this.speakValidation = globals;

  }

  ngOnInit() {
  }

  title = 'Wilder';

  habilitableSpeak() {
    this.globals.role = !this.globals.role;
  }
}
