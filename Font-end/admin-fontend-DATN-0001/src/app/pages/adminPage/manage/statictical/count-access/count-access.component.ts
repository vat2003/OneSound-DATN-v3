import { Component, OnInit } from '@angular/core';
import { IpServiceService } from '../../../adminEntityService/adminService/ipService/ip-service.service';
import { log } from 'node:console';
import { StaticticalComponent } from '../statictical/statictical.component';
import { StaticticalService } from '../../../adminEntityService/adminService/statictical/statictical.service';
import { Visit } from '../../../adminEntityService/adminEntity/DTO/visit';
import { CommonModule, DatePipe } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-count-access',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule],
  providers: [DatePipe],
  templateUrl: './count-access.component.html',
  styleUrl: './count-access.component.scss'
})
export class CountAccessComponent implements OnInit {

  listVisit: Visit[] = [];
  p: number = 1;
  pageSize: number = 5;
  constructor(
    private ipService: IpServiceService,
    private staticticalService: StaticticalService,
    private datePipe: DatePipe
  ) { }




  ngOnInit(): void {
    this.getAllVisit();
  }



  getAllVisit() {
    this.staticticalService.getVisitWDate().subscribe((data) => {
      this.listVisit = data;
      console.log(this.listVisit);

    })


  }
}
