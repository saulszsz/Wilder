import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.css']
})
export class GraphicsComponent implements OnInit {

  public doughnutChartLabels = ['Activo', 'Herramienta', 'Otro'];
  public doughnutChartData = [120, 150, 180];
  public doughnutChartType = 'doughnut';

  constructor() { }

  ngOnInit(): void {
  }

}
