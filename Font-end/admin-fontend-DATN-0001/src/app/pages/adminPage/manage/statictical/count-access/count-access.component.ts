import { Component } from '@angular/core';
import { IpServiceService } from '../../../adminEntityService/adminService/ipService/ip-service.service';

@Component({
  selector: 'app-count-access',
  standalone: true,
  imports: [],
  providers: [IpServiceService],
  templateUrl: './count-access.component.html',
  styleUrl: './count-access.component.scss'
})
export class CountAccessComponent {
  constructor(private ipService: IpServiceService) { }

  ngOnInit() {

  }

  showIp() {
    this.ipService.getIpAddress().subscribe((data: any) => {
      const ipAddress = data.ip;
      alert(ipAddress);
    });
  }
}
