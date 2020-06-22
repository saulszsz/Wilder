import { FireService } from './../../../../services/fire.service';
import { Component, OnInit, Input } from '@angular/core';

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
    private _fs: FireService
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

  envioPrevioRegistro() {
    let payload = {
      
    }
  }

  envio() {

  }

}
