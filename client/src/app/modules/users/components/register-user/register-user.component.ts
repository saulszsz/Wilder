import { MyErrorStateMatcher } from './../../../../models/error-state-matcher/error-state-matcher.module';
import { FireService } from './../../../../services/fire.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {
  formulario = new FormGroup({});
  matcher = new MyErrorStateMatcher();

  workplace: string;
  name: string;
  lastname: string;
  birthday: Date;
  phone: number;
  mail: string;
  pwd1: string;
  pwd2: string;

  @Input() uid: string;
  @Input() method: string;

  constructor(
    private _fs: FireService,
    private _router: Router,
    private _fb: FormBuilder,
    private _snack: MatSnackBar
  ) {
    if (this.uid) {
      this.formulario = this._fb.group({
        'correo': [
          '',
          [
            Validators.required
          ]
        ],
        'trabajo': ['',
          [

          ]
        ],
        'nombre': ['',
          [

          ]
        ],
        'apellido': ['',
          [

          ]
        ],
        'nacimiento': ['',
          [

          ]
        ],
        'telefono': ['',
          [

          ]
        ],
      });
    } else if (this.uid && this.method == 'phone') {
      this.formulario = this._fb.group({
        'correo': ['',
          [

          ]
        ],
        'trabajo': ['',
          [

          ]
        ],
        'nombre': ['',
          [

          ]
        ],
        'apellido': ['',
          [

          ]
        ],
        'nacimiento': ['',
          [

          ]
        ],
        'telefono': ['',
          [

          ]
        ],
      });
    } else {
      this.formulario = this._fb.group({
        'pwd1': ['',
          [
            Validators.required,
            Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&.])[A-Za-z\d$@$!%*?&.].{8,}")
          ]
        ],
        'pwd2': ['',
          [
            Validators.required
          ]
        ],
        'correo': ['',
          [
            Validators.required,
            Validators.email
          ]
        ],
        'trabajo': ['',
          [
            Validators.required
          ]
        ],
        'nombre': ['',
          [
            Validators.required
          ]
        ],
        'apellido': ['',
          [
            Validators.required
          ]
        ],
        'nacimiento': ['',
          [
            Validators.required
          ]
        ],
        'telefono': ['',
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10)
          ]
        ],
      }, { validator: this.checkPwd });
    }
  }

  ngOnInit(): void {
    if (this.uid && this.method != 'phone') {
      this._fs.getEmailLogged(this.uid).subscribe(
        (email: string) => {
          this.formulario.setValue({
            correo: email
          });
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  envioPrevioRegistro(evt) {
    evt.preventDefault();
    let payload = {
      uid: this.uid,
      tipo: 'admin',
      correo: this.mail,
      trabajo: this.workplace,
      nombre: this.name,
      apellido: this.lastname,
      nacimiento: this.birthday,
      telefono: this.phone
    }
    this._fs.createUserPreviousRegistering(payload).subscribe(
      (result: any) => {
        if (result.creado)
          alert("creado!");
        else
          alert("no creado!");
        this._router.navigate(['/']);
      },
      (error: any) => {
        alert("Error!!! " + JSON.stringify(error));
      }
    );
  }

  errorHandling = (control: string, error: string) => {
    return this.formulario.controls[control].hasError(error);
  }

  envio(evt: any) {
    if (!this.formulario.valid) {
      this._snack.open('¡Tu formulario no está en condiciones de ser enviado!', 'OK', {
        duration: 5000,
        verticalPosition: 'top'
      });
      return;
    }
    var that = this;
    this._fs.signIn(this.formulario.get('correo').value, this.formulario.get('pwd1').value).then(({ user }) => {
      user.getIdToken().then(
        (idToken) => {
          this._fs.setCookieSession(idToken).subscribe(
            (response) => {
              that._fs.createUserPreviousRegistering({
                uid: user.uid,
                tipo: 'admin',
                correo: this.formulario.get('correo').value,
                trabajo: this.formulario.get('trabajo').value,
                nombre: this.formulario.get('nombre').value,
                apellido: this.formulario.get('apellido').value,
                nacimiento: this.formulario.get('nacimiento').value,
                telefono: this.formulario.get('telefono').value
              }).subscribe(
                (result: any) => {
                  if (result.creado)
                    alert("creado!");
                  else
                    alert("no creado!");
                  this._router.navigate(['/']);
                },
                (error: any) => {
                  alert("Error!!! " + JSON.stringify(error));
                }
              );
            },
            (error) => {
              alert("Has tenido un errror.");
            }
          );
        });
    });
  }

  checkPwd(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.get('pwd1').value;
    let confirmPass = group.get('pwd2').value;

    return pass === confirmPass ? null : { notSame: true }
  }

}
