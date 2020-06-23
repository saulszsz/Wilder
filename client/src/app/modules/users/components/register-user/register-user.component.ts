import { FireService } from './../../../../services/fire.service';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {
  workplace: string;
  name: string;
  lastname: string;
  birthday: Date;
  phone: number;
  mail: string;
  pwd1: string;
  pwd2: string;

  @Input() uid: string;

  constructor(
    private _fs: FireService,
    private _router: Router
  ) {

  }

  ngOnInit(): void {
    if (this.uid) {
      this._fs.getEmailLogged(this.uid).subscribe(
        (email: string) => {
          this.mail = email;
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
        alert("Error!!! "+JSON.stringify(error));
      }
    );
  }

  envio() {

  }

}
