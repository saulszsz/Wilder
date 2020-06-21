import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string;
  date: string;
  storage: string;
  extension: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Tarea 1', date: '21/02/2020', storage: '12 Mb', extension: 'DOCX'},
  {name: 'Tarea 2', date: '22/02/2020', storage: '13 Mb', extension: 'DOCX'},
  {name: 'Tarea 3', date: '25/02/2020', storage: '9 Mb', extension: 'DOCX'},
  {name: 'Tarea 4', date: '27/02/2020', storage: '17 Mb', extension: 'DOCX'},
  {name: 'Tarea 5', date: '28/02/2020', storage: '10 Mb', extension: 'DOCX'},
 
 
];

@Component({
  selector: 'app-myfiles',
  templateUrl: './myfiles.component.html',
  styleUrls: ['./myfiles.component.css']
})
export class MyfilesComponent implements OnInit {

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}