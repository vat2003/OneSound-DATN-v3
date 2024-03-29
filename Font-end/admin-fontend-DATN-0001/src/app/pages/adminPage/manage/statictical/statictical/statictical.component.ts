import { Component } from '@angular/core';
import { ReportComponent } from '../report/report.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ListenStatsComponent } from '../listen-stats/listen-stats.component';
import { TotalComponent } from '../total/total.component';

@Component({
  selector: 'app-statictical',
  standalone: true,
  imports: [ReportComponent, RouterLink,
    RouterOutlet, ReportComponent, ListenStatsComponent, TotalComponent],
  templateUrl: './statictical.component.html',
  styleUrl: './statictical.component.scss'
})
export class StaticticalComponent {

}
