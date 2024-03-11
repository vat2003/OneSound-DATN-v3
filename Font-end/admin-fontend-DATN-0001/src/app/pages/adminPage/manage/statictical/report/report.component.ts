import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { StaticticalService } from '../../../adminEntityService/adminService/statictical/statictical.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CountUserByDate } from '../../../adminEntityService/adminEntity/DTO/count-user-by-date';
import { CommonModule, DatePipe } from '@angular/common';
import { account } from '../../../adminEntityService/adminEntity/account/account';
import { NgxPaginationModule } from 'ngx-pagination';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { log } from 'console';

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule,
    NgChartsModule,

  ],
  providers: [DatePipe],

  templateUrl: './report.component.html',
  styleUrl: './report.component.css'
})
export class ReportComponent implements OnInit {
  quantityUsers!: number;
  minDate: string;
  maxDate: string
  dateCheck!: string;;
  date!: Date
  check!: number;
  dateCountUser1!: Date;
  dateCountUser2!: Date;
  userDatas: any[] = [];
  dateLables: any[] = [];

  dateControl = new FormControl();
  // bsConfig: Partial<BsDatepickerConfig>;
  // countUser: CountUserByDate[] = [];
  countUser: any[] = []
  p: number = 1;
  pU: number = 1;
  sort: number = 0;
  sortId: number = 0;
  pageSize: number = 5;
  errorm!: string;
  user: account[] = [];
  day!: number;
  month!: number;
  year!: number;


  constructor(
    private staticticalService: StaticticalService,
    private datePipe: DatePipe,
    private renderer: Renderer2,
    private el: ElementRef
  ) {
    const today = new Date();
    const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const minDate = new Date(2024, 0, 1); // 1/1/2024

    // Format minDate và maxDate dưới dạng yyyy-MM-dd
    this.minDate = minDate.toISOString().split('T')[0];
    this.maxDate = maxDate.toISOString().split('T')[0];




  }

  showDate() {
    const selectedTimestamp = new Date(this.date).getTime();
    // if (selectedTimestamp < todayTimestamp && selectedTimestamp > limitTimestamp) {
    this.staticticalService.getAllUserByDateLong(selectedTimestamp).subscribe(
      (res) => {
        this.user = res
        console.log("-------------------" + res);
        if (res.length == 0) {
          this.check = 1;
          console.log(this.check);

          this.errorm = "Not found users!";
        } else {
          this.check = 0;
        }
      }
    )

    // } else {
    //   alert("Must select a date from 01-01-2024 to the current date!")
    // }

  }




  formatDate(date: Date): Date {
    const year = date.getFullYear();
    const month = date.getMonth(); // Lấy tháng
    const day = date.getDate(); // Lấy ngày
    return new Date(year, month, day); // Trả về một đối tượng Date mới với năm, tháng và ngày được trích xuất
  }

  formatDateReturnDate(date: Date): Date {
    const year = date.getUTCFullYear();
    const month = ('0' + (date.getUTCMonth() + 1)).slice(-2);
    const day = ('0' + date.getUTCDate()).slice(-2);
    return new Date(Date.UTC(year, parseInt(month) - 1, parseInt(day))); // Tạo một đối tượng Date mới từ các thành phần ngày, tháng và năm
  }



  ngOnInit(): void {
    this.getQuantityUser();
    console.log(this.dateLables);
    console.log(this.userDatas);
    this.displaySelectedMonth();
    this.displaySelectedDay();
    this.displaySelectedYear();
  }

  getLabel() {
    const listLabel = [];
    this.staticticalService.getQuantityUser(1).subscribe(
      (res) => {

        this.dateLables = res.map(item => new Date(item.createDate).toLocaleDateString());

      }
    );
    return this.dateLables;
  }

  getData() {
    this.staticticalService.getQuantityUser(1).subscribe(
      (res) => {
        this.userDatas = res.map(item => item.id);
      }
    );
    return this.userDatas;
  }

  //Line Chart
  lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: this.getLabel(),
    datasets: [
      {
        data: this.getData(),
        label: 'User',
        fill: false,
        tension: 0.5,

        // backgroundColor: 'rgba(255,0,0,0.3)'
      },
    ],
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
  };
  public lineChartLegend = true;

  //-----------------------------------------------

  //Bar chart
  barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      data: [47, 0, 6]
    }]
  };

  public BarChartOptions: ChartOptions<'bar'> = {
    responsive: true,
  };
  public BarChartLegend = true;



  //-----------------------------------------------





  getQuantityUser() {

    this.staticticalService.getQuantityUser(1).subscribe(
      (res) => {
        this.countUser = res


        this.userDatas = res.map(item => item.id);

      }
    );

  }



  sortByCreatedDate() {
    if (this.sort == 0) {
      this.staticticalService.getQuantityUser(0).subscribe(
        (res) => { this.countUser = res }
      );
      this.sort = 1;
    } else {
      this.countUser.reverse();
      this.sort = 0;
    }

  }

  sortByCreatedId() {
    if (this.sort == 0) {
      this.staticticalService.getQuantityUserById(0).subscribe(
        (res) => { this.countUser = res }
      );
      this.sort = 1;
    } else {
      this.countUser.reverse();
      this.sort = 0;
    }

  }

  getAllUserByDate(date: Date) {
    // // Tạo một đối tượng Date
    // const myDate = new Date();

    // // Chuyển đổi thành số bằng phương thức getTime()

    this.staticticalService.getAllUserByDate(date).subscribe(
      (res) => {
        this.user = res
        this.check = 0;
        console.log("-------------------" + this.user);

      }
    )
  }

  getCountUserBetweenDate() {
    const selectedTimestamp1 = new Date(this.dateCountUser1).getTime();
    const selectedTimestamp2 = new Date(this.dateCountUser2).getTime();
    this.staticticalService.getCountUserBetweenDate(selectedTimestamp1, selectedTimestamp2).subscribe((res) => {
      this.countUser = res
      console.log("List count User: " + res);

    })
  }


  displaySelectedMonth() {
    const yaerSelect: HTMLSelectElement | null = this.el.nativeElement.querySelector(".month");
    if (yaerSelect) {
      const defaultOption: HTMLOptionElement = this.renderer.createElement("option");
      this.renderer.setProperty(defaultOption, 'value', ''); // Đặt giá trị rỗng
      this.renderer.setProperty(defaultOption, 'text', 'Select Month'); // Văn bản tùy chỉnh
      this.renderer.appendChild(yaerSelect, defaultOption);
      for (let month: number = 1; month <= 12; month++) {
        const option: HTMLOptionElement = this.renderer.createElement("option");
        this.renderer.setProperty(option, 'value', month.toString());
        this.renderer.setProperty(option, 'text', month.toString());
        this.renderer.appendChild(yaerSelect, option);
      }
    }
  }
  displaySelectedDay() {
    const daySelect: HTMLSelectElement | null = this.el.nativeElement.querySelector(".day");
    if (daySelect) {
      const defaultOption: HTMLOptionElement = this.renderer.createElement("option");
      this.renderer.setProperty(defaultOption, 'value', ''); // Đặt giá trị rỗng
      this.renderer.setProperty(defaultOption, 'text', 'Select Day'); // Văn bản tùy chỉnh
      this.renderer.appendChild(daySelect, defaultOption);
      for (let day: number = 1; day <= 31; day++) {
        const option: HTMLOptionElement = this.renderer.createElement("option");
        this.renderer.setProperty(option, 'value', day.toString());
        this.renderer.setProperty(option, 'text', day.toString());
        this.renderer.appendChild(daySelect, option);
      }
    }
  }
  displaySelectedYear() {
    const yaerSelect: HTMLSelectElement | null = this.el.nativeElement.querySelector(".year");
    if (yaerSelect) {
      const currentYear: number = new Date().getFullYear();
      const startYear: number = 2024;
      const defaultOption: HTMLOptionElement = this.renderer.createElement("option");
      this.renderer.setProperty(defaultOption, 'value', ''); // Đặt giá trị rỗng
      this.renderer.setProperty(defaultOption, 'text', 'Select Year'); // Văn bản tùy chỉnh
      this.renderer.appendChild(yaerSelect, defaultOption);
      for (let year: number = currentYear; year >= startYear; year--) {
        const option: HTMLOptionElement = this.renderer.createElement("option");
        this.renderer.setProperty(option, 'value', year.toString());
        this.renderer.setProperty(option, 'text', year.toString());
        this.renderer.appendChild(yaerSelect, option);
      }
    }
  }

  getUserByOption() {
    let dayParam = this.day ? this.day : this.day = -1;
    let monthParam = this.month ? this.month : this.month = -1;
    let yearParam = this.year ? this.year : this.year = -1;
    this.staticticalService.getUserByOption(dayParam, monthParam, yearParam).subscribe((res) => {
      this.user = res;
      console.log("-------------------" + res);
      if (res.length == 0) {
        this.check = 1;
        console.log(this.check);
        this.errorm = "Not found users!";
      } else {
        this.check = 0;
      }
    });
  }

  showDateSelect() {
    alert(this.year)
  }


}
