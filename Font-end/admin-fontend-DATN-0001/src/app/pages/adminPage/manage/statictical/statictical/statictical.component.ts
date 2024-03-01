import { Component } from '@angular/core';
import { ReportComponent } from '../report/report.component';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-statictical',
  standalone: true,
  imports: [ReportComponent, RouterLink,
    RouterOutlet],
  templateUrl: './statictical.component.html',
  styleUrl: './statictical.component.scss'
})
export class StaticticalComponent {

}
