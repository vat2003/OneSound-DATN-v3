import {Component, OnInit} from '@angular/core';
import {ListeningStatsService} from '../../../../../services/listening-stats/listening-stats.service';
import {CommonModule} from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';
import {FormsModule} from '@angular/forms';
import {StaticticalService} from '../../../adminEntityService/adminService/statictical/statictical.service';
import {isThisSecond} from 'date-fns';
import {Listens} from '../../../adminEntityService/adminEntity/listens/listens';
import {FirebaseStorageCrudService} from "../../../../../services/firebase-storage-crud.service";

@Component({
  selector: 'app-listen-stats',
  standalone: true,
  imports: [
    CommonModule,
    NgxPaginationModule,
    FormsModule,

  ],
  templateUrl: './listen-stats.component.html',
  styleUrl: './listen-stats.component.css'
})
export class ListenStatsComponent implements OnInit {
  dateCountUser1!: Date;
  dateCountUser2!: Date;
  minDate: string;
  maxDate: string;
  listens: any[] = [];
  top10Listen: any[] = [];
  check!: number;
  errorm!: string;
  pAllList: number = 1;
  pageSize: number = 10;

  constructor(
    private listeningService: ListeningStatsService,
    private statictical: StaticticalService,
    private firebaseStorage: FirebaseStorageCrudService,
  ) {
    const day = new Date();
    const today = new Date();
    today.setDate(today.getDate() + 1)
    const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const minDate = new Date(2024, 0, 1); // 1/1/2024

    // Format minDate và maxDate dưới dạng yyyy-MM-dd
    this.minDate = minDate.toISOString().split('T')[0];
    this.maxDate = maxDate.toISOString().split('T')[0];

  }

  ngOnInit(): void {
    this.getAllListens();
    this.getTop10Listens();

  }

  getAllListens() {
    this.statictical.getAllListens().subscribe((res) => {
      res.forEach((data) => {
        data.song.image = this.setImageURLFirebase(data.song.image);
        console.log(data.song.image)
      })
      this.listens = res;
    })
  }

  async setImageURLFirebase(image: string): Promise<string> {
    if (image != null) {
      return await this.firebaseStorage.getFile(image);
    } else {
      return 'null';
    }
  }


  getListenBetweenLisDate() {
    if (!this.dateCountUser1 || !this.dateCountUser2) {
      alert("Please choose form date and to date!");
    } else {
      const selectedTimestamp1 = new Date(this.dateCountUser1).getTime();
      const selectedTimestamp2 = new Date(this.dateCountUser2).getTime();

      this.statictical.getListensBetweenLisDate(selectedTimestamp1, selectedTimestamp2).subscribe((res) => {
        this.listens = res;
        this.listens.forEach((data) => {
          data.song.image = this.setImageURLFirebase(data.song.image);
        })
        if (res.length == 0) {
          this.check = 1;
          console.log(this.check);
          this.errorm = "Not found users!";
        } else {
          this.check = 0;
        }
      })
    }

  }

  getTop10Listens() {
    this.statictical.getTop10Listens().subscribe((res) => {
      res.forEach((data) => {
        data.song.image = this.setImageURLFirebase(data.song.image);
      })
      this.top10Listen = res;
    });
  }

}
