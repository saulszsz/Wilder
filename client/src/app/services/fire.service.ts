import { CookieService } from 'ngx-cookie-service';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FireService {

  constructor(
    private _afAuth: AngularFireAuth,
    private _fireDb: AngularFireDatabaseModule,
    private _http: HttpClient,
    public _cs: CookieService
  ) { }

  loginGoogle() {
    return this._afAuth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  cerrarSesion() {
    return this._afAuth.signOut();
  }

  getEmailLogged(uid: string) {
    return this._http.get(
      `email_logged/${uid}`
    );
  }

  needRegistration(idToken: string): Observable<any> {
    return this._http.get(
      `needs_register/${idToken}`
    );
  }
}
