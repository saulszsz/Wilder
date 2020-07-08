import { FormsService } from './../../../../services/forms.service';
import { WindowService } from './../../../../services/window.service';
import { FireService } from './../../../../services/fire.service';
import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  mail: String;
  password: string;

  uid: string;
  method: string;
  props = { uid: null, method: null };
  registro = false;
  allow = false;

  windowRef: any = this._win.windowRef;;
  verifier: any;
  codigo: any;
  formulario: FormGroup
  formulario_login: FormGroup

  constructor(
    private _fs: FireService,
    private _router: Router,
    private _win: WindowService,
    private _fb: FormBuilder,
    public _forms: FormsService,
    private _snack: MatSnackBar,
    private _changes: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    var that = this;
    this.windowRef.recaptchaVerifier = new auth.RecaptchaVerifier('recaptcha-container', {
      'callback': (response) => {
        that.allow = true;
        that._changes.detectChanges();
      },
      'expired-callback': () => {
        that.allow = false;
        that._changes.detectChanges();
      }
    });
    this.windowRef.recaptchaVerifier.render();
    this.verifier = this.windowRef.recaptchaVerifier;
  }

  ngOnInit(): void {
    this.formulario = this._fb.group({
      'area': ['',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(3)
        ]
      ],
      'prefix': ['',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(3)
        ]
      ],
      'line': ['',
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(4)
        ]
      ]
    });

    this.formulario_login = this._fb.group({
      'mail': ['',
        [
          Validators.required,
          Validators.email
        ]
      ],
      'password': ['',
        [
          Validators.required
        ]
      ],
    });
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
                    that.props = { uid: user.uid, method: 'google' }
                    that.registro = r;
                    if (!that.registro) {
                      this._snack.open("Éxito.", 'OK');
                      window.location.href = "/";
                    }
                  },
                  (e: any) => {
                    this._snack.open("Error en componente de login.", 'OK');
                  }
                );
              },
              (error) => {
                this._snack.open("Has tenido un error.", 'OK');
              }
            );
          });
      });
    } else if (method == 'facebook') {

    } else if (method == 'password') {
      this._fs.iniciarSesionTradicional(this.formulario_login.get('mail').value, this.formulario_login.get('password').value).then(({ user }) => {
        user.getIdToken().then(
          (idToken) => {
            this._fs.setCookieSession(idToken).subscribe(
              (response) => {
                this._router.navigate(['/']);
              },
              (error: any) => {
                this._snack.open("Error!!! " + JSON.stringify(error), 'OK', {
                  duration: 5000,
                  verticalPosition: 'top'
                });
              }
            );
          });
      }, (error) => {
        this._snack.open("Usuario y/o contraseña inválidos.", 'OK', {
          duration: 5000,
          verticalPosition: 'top'
        });
      });
    } else if (method == 'phone') {
      // this.props = { uid: null, method: 'phone' }
      // this.registro = true;
      this.method = method;
    }
  }


  telefono(evt: any) {
    evt.preventDefault();
    const appVerifier = this.windowRef.recaptchaVerifier;

    auth().signInWithPhoneNumber(this.e164, appVerifier).then(
      result => {
        this.windowRef.confirmationResult = result;
        this.allow = false;
      }
    ).catch(
      error => this._snack.open('Contacta al administrador. ' + error.message, 'OK', {
        duration: 10000,
        verticalPosition: 'top'
      })
    )
  }

  verifyLoginCode() {
    var that = this;
    this.windowRef.confirmationResult
      .confirm(this.codigo)
      .then(
        (result) => {
          result.user.getIdToken().then(
            (idToken) => {
              this._fs.setCookieSession(idToken).subscribe(
                (response) => {
                  that.uid = result.user.uid;
                  this._fs.needRegistration(result.user.uid).subscribe(
                    (r: any) => {
                      that.props = { uid: result.user.uid, method: 'phone' }
                      that.registro = r;
                      if (!that.registro) {
                        this._router.navigate(['/']);
                      }
                    },
                    (e: any) => {
                      this._snack.open("Error en componente de login.", 'OK');
                    }
                  );
                },
                (error) => {
                  this._snack.open("Has tenido un errror.", 'OK');
                }
              );
            });
        }
      )
      .catch(
        error => this._snack.open('Contacta al administrador.' + error.message, 'OK', {
          duration: 10000,
          verticalPosition: 'top'
        })
      )
  }

  get e164() {
    const num = "+52" + this.formulario.get('area').value + this.formulario.get('prefix').value + this.formulario.get('line').value;

    return `${num}`;
  }
}
