import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-listgen',
  templateUrl: './listgen.component.html',
  styleUrls: ['./listgen.component.css']
})
export class ListgenComponent implements OnInit {
  entregablesPendientes = [
    'Laptop Acer VX5',
    'Impresora HP Laserjet'
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
