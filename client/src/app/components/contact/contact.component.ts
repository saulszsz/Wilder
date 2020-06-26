import { ApiService } from './../../services/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  mail:String;
  constructor(
    private _api: ApiService
  ) { }

  ngOnInit(): void {
  }

  subirForma() {
    this._api.sendMail({
      
    }).subscribe(
      (success) => {},
      (error) => {}
    );
  }
}
