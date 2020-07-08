import { CookieService } from 'ngx-cookie-service';
import { AngularFireDatabase } from '@angular/fire/database';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { repeat } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FireService {

  constructor(
    public _afAuth: AngularFireAuth,
    private _http: HttpClient,
    public _cs: CookieService,
    public _fireDb: AngularFireDatabase,
    public _router: Router
  ) { }

  loginGoogle() {
    return this._afAuth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  signIn(email: string, password: string) {
    return this._afAuth.createUserWithEmailAndPassword(email, password);
  }

  iniciarSesionTradicional(email: string, password: string) {
    return this._afAuth.signInWithEmailAndPassword(email, password);
  }

  cerrarSesion() {
    var that = this;
    return this._afAuth.signOut().then(function () {
      that._http.post("logout", {}, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          'XSRF-TOKEN': this._cs.get('XSRF-TOKEN')
        }
      }).subscribe(
        (r) => {
          that._router.navigate(['/']);
        }
      );
    });
  }

  eliminarSolicitud(id_solicitud: string, id_activo: string) {
    return this._http.get(
      `eliminar_solicitud/${id_solicitud}/${id_activo}`
    );
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


  createNormalUser(payload: any) {
    return this._http.post(
      `create_normal_user`,
      payload, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'XSRF-TOKEN': this._cs.get('XSRF-TOKEN')
      }
    }
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

  createMantenimiento(payload: any) {
    return this._http.post(
      `create_mantenimiento`,
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
      `get_user/${uid}/`
    );
  }

  obtenerMttos(id_activo: string) {
    return this._http.get(
      `get_mttos/${id_activo}/`
    );
  }

  regresarActivo(uid: string, uid_activo: string) {
    return this._http.get(
      `regresar_activo/${uid}/${uid_activo}`
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

  createPrestamo(payload: any) {
    return this._http.post(
      `create_prestamo`,
      payload, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'XSRF-TOKEN': this._cs.get('XSRF-TOKEN')
      }
    }
    );
  }

  getActivos(trabajo_uid: string) {
    return this._http.get(
      `activos_list/${trabajo_uid}`
    );
  }

  getActivo(payload: any) {
    var rep = this._http.post(
      `get_activo`,
      payload, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'XSRF-TOKEN': this._cs.get('XSRF-TOKEN')
      }
    }
    );
    return rep;
  }


  editActivo(payload: any, idActivo: string) {
    return this._http.post(
      `edit_activo/${idActivo}`,
      payload, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'XSRF-TOKEN': this._cs.get('XSRF-TOKEN')
      }
    }
    );
  }

  solicitarActivo(idActivo: string, idUser: string, idCompany: string) {
    return this._http.post(
      `solicitar_activo/${idActivo}`, {
      id: idActivo,
      fecha: new Date(Date.now()),
      id_usuario: idUser,
      company: idCompany,
      abierto: true
    }, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'XSRF-TOKEN': this._cs.get('XSRF-TOKEN')
      }
    });
  }

  getSolicitudes(idCompany: string) {
    return this._http.get(
      `get_solicitudes/${idCompany}`
    );
  }

  getPrestamos(idUser: string) {
    return this._http.get(
      `get_prestamos/${idUser}`
    );
  }

  deletActivo(idActivo: string) {
    return this._http.post(
      `delet_activo/${idActivo}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        'XSRF-TOKEN': this._cs.get('XSRF-TOKEN')
      }
    });
  }
}
