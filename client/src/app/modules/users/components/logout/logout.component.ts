import { FireService } from './../../../../services/fire.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    private _fs: FireService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this._fs.cerrarSesion();
  }

}
