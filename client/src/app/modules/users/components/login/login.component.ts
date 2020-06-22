import { FireService } from './../../../../services/fire.service';
import { Component, OnInit } from '@angular/core';

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
    private _fs: FireService
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
        that.uid = user.uid;
        this._fs.needRegistration(user.uid).subscribe(
          (r: any) => {
            that.registro = r;
          },
          (e: any) => { }
        );
        return user.getIdToken().then((idToken) => {
          return fetch("/sessionLogin", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              'XSRF-TOKEN': this._fs._cs.get('XSRF-TOKEN')
            },
            body: JSON.stringify({ idToken }),
          });
        });
      });
    } else if (method == 'facebook') {

    } else if (method == 'password') {

    }
  }

}
