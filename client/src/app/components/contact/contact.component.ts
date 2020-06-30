import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  name:String;
  phone:String;
  mail:String;
  message:String;

  todoForm: FormGroup;

  constructor(
    private _api: ApiService, private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.todoForm=this.formBuilder.group({
      nombre: ['',Validators.required],
      telefono: ['',Validators.required],
      correo: ['',Validators.required],
      mensaje: ['',Validators.required]
    });
  }

  subirForma(evt) {
    evt.preventDefault();
    this._api.sendMail({
      name: this.name,
      phone: this.phone,
      mail: this.mail,
      message: this.message
    }).subscribe(
      (success) => {},
      (error) => {}
    );
  }
}
