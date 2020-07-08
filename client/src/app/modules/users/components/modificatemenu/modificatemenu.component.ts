import { WindowService } from './../../../../services/window.service';
import { MyErrorStateMatcher } from './../../../../models/error-state-matcher/error-state-matcher.module';
import { FireService } from './../../../../services/fire.service';
import { Component, OnInit, Input, AfterContentInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-modificatemenu',
  templateUrl: './modificatemenu.component.html',
  styleUrls: ['./modificatemenu.component.css']
})
export class ModificatemenuComponent implements OnInit, AfterViewInit {

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
    private _win: WindowService,
    private _route: ActivatedRoute,
  ) {

  }

  idUser: string;
  datosUsuario: any = {
    apellido: "",
    email: "",
    nacimiento: "",
    nombre: "",
    telefono: 0,
    tipo: "",
    trabajo: ""
  };

  ngAfterViewInit() {

  }

  uid = this._fs._afAuth.authState.pipe(
    map(authState => {
      if (!authState) {
        return '';
      } else {
        return authState.uid;
      }
    })
  );

  user: any = this.uid.pipe(
    switchMap(uid => {
      if (!uid) {
        this._router.navigate(['/']);
      } else {
        return this._fs._fireDb.object('users/' + uid).valueChanges();
      }
    }),
  );

  company: string = null;

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
      }, {  });
    }

    this.idUser = this._route.snapshot.paramMap.get('uid');
    console.log(this.idUser);

    if (this.idUser != "0") {
      this.obtenerUsuario();
    }

    this.setData();
  }

  obtenerUsuario() {
    let payload = {
      uid: this.idUser
    }
    this._fs.getUsuario(payload).subscribe(
      (result: any) => {
        if (result) {
          if (result == "null") {
            this._snack.open("Usuario no encontrado.1", 'OK', {
              duration: 8000,
              verticalPosition: 'bottom'
            });
            this._router.navigate(['/usermenu']);
          } else {
            console.log("Primer log");
            this.datosUsuario = JSON.parse(result);
            console.log(this.datosUsuario);
          }
        } else {
          this._snack.open("Usuario no encontrado.2", 'OK', {
            duration: 8000,
            verticalPosition: 'bottom'
          });
          this._router.navigate(['/usermenu']);
        }
      },
      (error: any) => {
        this._snack.open("Error! " + JSON.stringify(error), 'OK', {
          duration: 8000,
          verticalPosition: 'bottom'
        });
      }
    );
    console.log(this.datosUsuario);
  }

  setData() {
    var that = this;
    this.user.subscribe(
      (user: any) => {
        this.formulario.patchValue({
          trabajo: user['trabajo']
        });
      },
      (error) => {
        this._snack.open('Contacta al administrador.', 'OK', {
          duration: 8000,
          verticalPosition: 'top'
        });
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
    that._fs.updateUser({
      uid: this.idUser,
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
          this._snack.open('¡Usuario modificado!', 'OK', {
            duration: 5000,
            verticalPosition: 'top'
          });
        else
          this._snack.open('Usuario no modificado. Consulta a tu administrador.', 'OK', {
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


}
