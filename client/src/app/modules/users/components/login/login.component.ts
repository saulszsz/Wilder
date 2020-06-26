import { FireService } from './../../../../services/fire.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  mail: String;
  password: string;
  uid: string;
  registro = false;

  constructor(
    private _fs: FireService,
    private _router: Router
  ) { }

  ngOnInit(): void {
  }

  login(method: string, evt = null) {
    if (evt) {
      evt.preventDefault();
    }

    if (method == 'google') {
      let that = this;
      this._fs.loginGoogle().then(({ user }) => {
        user.getIdToken().then(
          (idToken) => {
            this._fs.setCookieSession(idToken).subscribe(
              (response) => {
                that.uid = user.uid;
                this._fs.needRegistration(user.uid).subscribe(
                  (r: any) => {
                    that.registro = r;
                    if (!that.registro) {
                      this._router.navigate(['/']);
                    }
                  },
                  (e: any) => {
                    alert("Error en componente de login.");
                  }
                );
              },
              (error) => {
                alert("Has tenido un errror.");
              }
            );
          });
      });
    } else if (method == 'facebook') {

    } else if (method == 'password') {

    }
  }

}
