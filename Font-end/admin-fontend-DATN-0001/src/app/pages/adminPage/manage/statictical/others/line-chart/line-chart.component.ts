import { Component, Input } from '@angular/core';
import { ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './line-chart.component.html',
  styleUrl: './line-chart.component.scss'
})
export class LineChartComponent {
  @Input() dataUser!: any[];
  @Input() label!: any[];

  data: ChartData<'line'> = {
    labels: this.label,
    datasets: [
      {
        data: this.dataUser,
        label: ''
      }
    ]
  }
}
