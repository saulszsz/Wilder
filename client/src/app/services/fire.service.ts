import { CookieService } from 'ngx-cookie-service';
import { AngularFireDatabase } from '@angular/fire/database';
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
    private _http: HttpClient,
    public _cs: CookieService,
    public _fireDb: AngularFireDatabase
  ) { }

  loginGoogle() {
    return this._afAuth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  signIn(email: string, password: string) {
    return this._afAuth.createUserWithEmailAndPassword(email, password);
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

  getPhoneLogged(uid: string) {
    return this._http.get(
      `phone_logged/${uid}`
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

  goTo(link: string) {
    return this._http.post(
      'redirect',
      {
        liga: link
      }, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'XSRF-TOKEN': this._cs.get('XSRF-TOKEN')
        }
      }
    )
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

  setCookieSession(idToken: string) {
    return this._http.post(
      'sessionLogin/',
      {
        idToken: idToken
      }, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'XSRF-TOKEN': this._cs.get('XSRF-TOKEN')
        }
      }
    )
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
