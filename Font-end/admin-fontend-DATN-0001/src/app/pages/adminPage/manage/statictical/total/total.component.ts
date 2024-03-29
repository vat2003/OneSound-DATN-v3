import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { StaticticalService } from '../../../adminEntityService/adminService/statictical/statictical.service';
import { ChartConfiguration, ChartData, ChartEvent } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-total',
  standalone: true,
  imports: [NgChartsModule, CommonModule, FormsModule],
  templateUrl: './total.component.html',
  styleUrl: './total.component.scss'
})
export class TotalComponent {

  songs: number[] = [];
  album: number[] = [];
  genres: number[] = [];
  total: any[] = [];
  @ViewChild(BaseChartDirective) chart: BaseChartDirective<'bar'> | undefined;



  @ViewChild(BaseChartDirective) Chart: BaseChartDirective<'bar'> | undefined;

  constructor(
    private staticticalService: StaticticalService
  ) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.getData();
    this.barChartData.datasets[0].data = this.total;

    this.chart?.update();

  }
  ngAfterContentInit(): void {
    this.barChartData.datasets[0].data = this.getData();

    this.chart?.update();
  }
  ngOnInit(): void {
    this.getData();
    this.barChartData.datasets[0].data = this.total;
    this.chart?.update();
  }

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    // We use these empty structures as placeholders for dynamic theming.
    responsive: false
  };
  public barChartType = 'bar' as const;

  public barChartData: ChartData<'bar'> = {
    labels: ['Songs', 'Albums', 'Genres'],
    datasets: [
      { data: this.getData(), label: 'Total' }
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



  getData() {
    this.staticticalService.getCountSong().subscribe((res) => {
      this.total.push(res);
    });
    this.staticticalService.getCountGenres().subscribe((res) => {
      this.total.push(res)
    })
    this.staticticalService.getCountAlbum().subscribe((res) => {
      this.total.push(res)
    })
    return this.total;
  }

}
