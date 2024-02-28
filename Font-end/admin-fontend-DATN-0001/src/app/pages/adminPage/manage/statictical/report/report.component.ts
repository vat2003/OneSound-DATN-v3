import { Component, OnInit } from '@angular/core';
import { StaticticalService } from '../../../adminEntityService/adminService/statictical/statictical.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CountUserByDate } from '../../../adminEntityService/adminEntity/DTO/count-user-by-date';
import { CommonModule, DatePipe } from '@angular/common';
import { account } from '../../../adminEntityService/adminEntity/account/account';
import { NgxPaginationModule } from 'ngx-pagination';
import { log } from 'console';
@Component({
  selector: 'app-report',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule
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

  dateControl = new FormControl();
  // bsConfig: Partial<BsDatepickerConfig>;
  countUser: CountUserByDate[] = [];
  p: number = 1;
  pU: number = 1;
  sort: number = 0;
  sortId: number = 0;
  pageSize: number = 5;
  errorm!: string;
  user: account[] = [];
  constructor(
    private staticticalService: StaticticalService,
    private datePipe: DatePipe
  ) {
    const today = new Date();
    const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const minDate = new Date(2024, 0, 1); // 1/1/2024

    // Format minDate và maxDate dưới dạng yyyy-MM-dd
    this.minDate = minDate.toISOString().split('T')[0];
    this.maxDate = maxDate.toISOString().split('T')[0];



  }

  showDate() {
    // const today = new Date();
    // const limitDate = new Date(2024, 0, 1); // Ngày 1/1/2024


    // if (this.date > limitDate && this.date < today) {
    //   console.log('Ngày hợp lệ:', this.datePipe.transform(this.date, 'yyyy-MM-dd'));
    //   // Thực hiện các hành động khi ngày hợp lệ
    // } else {
    //   console.log('Ngày không hợp lệ');
    //   // Thực hiện các hành động khi ngày không hợp lệ
    // }

    const todayTimestamp = new Date().getTime();
    const limitTimestamp = new Date(2024, 0, 1).getTime(); // Timestamp của ngày 1/1/2024

    const selectedTimestamp = new Date(this.date).getTime();
    console.log(todayTimestamp);
    console.log(selectedTimestamp);


    // if (selectedTimestamp < todayTimestamp && selectedTimestamp > limitTimestamp) {
    this.staticticalService.getAllUserByDateLong(selectedTimestamp).subscribe(
      (res) => {
        this.user = res
        console.log("-------------------" + res);
        if (res.length == 0) {
          this.check = 1;
          console.log(this.check);

          this.errorm = "No users were created on date " + this.date + "!";
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

  }








  getQuantityUser() {

    this.staticticalService.getQuantityUser(1).subscribe(
      (res) => { this.countUser = res }
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

  openCalendar(): void {
    const datePicker = document.querySelector("input[name='date']") as HTMLInputElement;
    datePicker.focus();
  }







}
