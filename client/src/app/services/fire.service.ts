import { CookieService } from 'ngx-cookie-service';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FireService {

  constructor(
    public _afAuth: AngularFireAuth,
    private _fireDb: AngularFireDatabaseModule,
    private _http: HttpClient,
    public _cs: CookieService,
  ) { }

  loginGoogle() {
    return this._afAuth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  cerrarSesion() {
    var that = this;
    return this._afAuth.signOut().then(function () {
      that._http.post("logout", {}).subscribe(
        (r) => {
          var landingUrl = window.location.host + "/users/login";
          window.open(landingUrl, "_self");
        }
      );
    });
  }

  getEmailLogged(uid: string) {
    return this._http.get(
      `email_logged/${uid}`
    );
  }

  createUserPreviousRegistering(payload: any) {
    return this._http.post(
      `create_user_pr`,
      payload, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'XSRF-TOKEN': this._cs.get('XSRF-TOKEN')
      }
    }
    );
  }

  needRegistration(idToken: string): Observable<any> {
    return this._http.get(
      `needs_register/${idToken}`
    );
  }

  getUser(uid: string) {
    return this._http.get(
      `get_user/${uid}`
    );
  }

  createActivo(payload: any) {
    return this._http.post(
      `create_activo`,
      payload, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'XSRF-TOKEN': this._cs.get('XSRF-TOKEN')
        }
      }
    );
  }
}
