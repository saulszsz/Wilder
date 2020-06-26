import { FireService } from './../../../../services/fire.service';
import { Component, OnInit } from '@angular/core';
import { Route } from '@angular/compiler/src/core';
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
<<<<<<< Updated upstream
        user.getIdToken().then((idToken) => {
          fetch("/sessionLogin", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              'XSRF-TOKEN': this._fs._cs.get('XSRF-TOKEN')
            },
            body: JSON.stringify({ idToken }),
          }).then(
            (success) => {
              that.uid = user.uid;
              this._fs.needRegistration(user.uid).subscribe(
                (r: any) => {
                  that.registro = r;
                  if(!that.registro) {
                    this._router.navigate(['/']);
                  }
                },
                (e: any) => { }
              );
            },
            (error) => {
              console.log("Contacta al adminsitrador");
            }
          );
        });
=======
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
>>>>>>> Stashed changes
      });
    } else if (method == 'facebook') {

    } else if (method == 'password') {

    }
  }

}
