import { AfterContentInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData } from 'chart.js';
import { ChartEvent } from 'chart.js/dist/core/core.plugins';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { StaticticalService } from '../../../../adminEntityService/adminService/statictical/statictical.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { log } from 'console';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [NgChartsModule, CommonModule, FormsModule],
  providers: [StaticticalService],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent implements OnInit, AfterContentInit, OnChanges {
  barYear!: number;
  @Input() userData!: any[];
  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;
  countUserOrderByMonth!: any[];
  constructor(
    private staticticalService: StaticticalService,
  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.barChartData.datasets[0].data = this.userData;

    this.chart?.update();

  }
  ngAfterContentInit(): void {

  }
  ngOnInit(): void {
    this.barChartData.datasets[0].data = this.userData;

    this.chart?.update();
  }

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
    responsive: false
  };
  public barChartType = 'bar' as const;

  public barChartData: ChartData<'bar'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    datasets: [
      { data: this.getData(new Date().getFullYear()), label: 'User' }
    ],
  };

  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }

  public randomize(): void {
    this.barChartData.datasets[0].data = this.getData(this.barYear);
    this.chart?.update();

  }

  getData(year: number) {
    this.staticticalService.getCountUserByYearOrderByMonth(year).subscribe((res) => {
      this.countUserOrderByMonth = res.map(item => item.count);
    })
    return this.countUserOrderByMonth;
  }
}
