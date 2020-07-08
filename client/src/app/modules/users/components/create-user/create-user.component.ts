import { WindowService } from './../../../../services/window.service';
import { MyErrorStateMatcher } from './../../../../models/error-state-matcher/error-state-matcher.module';
import { FireService } from './../../../../services/fire.service';
import { Component, OnInit, Input, AfterContentInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit, AfterViewInit {
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

  @Input() props: any;

  constructor(
    private _fs: FireService,
    private _router: Router,
    private _fb: FormBuilder,
    private _snack: MatSnackBar,
    private _win: WindowService
  ) {

  }

  ngAfterViewInit() {

  }

  ngOnInit(): void {
    if (!this.props) {
      this.props = { uid: null, method: null }
    }
    if (this.props.uid) {
      this.formulario = this._fb.group({
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
        ]
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
    that._fs.createNormalUser({
      tipo: 'normal',
      correo: this.formulario.get('correo').value,
      trabajo: this.formulario.get('trabajo').value,
      nombre: this.formulario.get('nombre').value,
      apellido: this.formulario.get('apellido').value,
      nacimiento: this.formulario.get('nacimiento').value,
      telefono: this.formulario.get('telefono').value
    }).subscribe(
      (result: any) => {
        if (result.creado)
          this._snack.open('¡Usuario creado!', 'OK', {
            duration: 5000,
            verticalPosition: 'top'
          });
        else
          this._snack.open('Usuario no creado. Consulta a tu administrador.', 'OK', {
            duration: 5000,
            verticalPosition: 'top'
          });
        this._router.navigate(['/usermenu']);
      },
      (error: any) => {
        this._snack.open("Error!!! " + JSON.stringify(error), 'OK', {
          duration: 5000,
          verticalPosition: 'top'
        });
      }
    );
  }

  checkPwd(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.get('pwd1').value;
    let confirmPass = group.get('pwd2').value;

    return pass === confirmPass ? null : { notSame: true }
  }

}
