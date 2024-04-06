import { Component } from '@angular/core';
import bootstrap from '../../../../main.server';
import { ActivatedRoute } from '@angular/router';
import { HistoryListensService } from '../../../services/history-listens/history-listens.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataGlobalService } from '../../../services/data-global.service';
import { FirebaseStorageCrudService } from '../../../services/firebase-storage-crud.service';

@Component({
  selector: 'app-history-listens',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './history-listens.component.html',
  styleUrl: './history-listens.component.scss'
})
export class HistoryListensComponent {

  accountId!: number;
  history: any[] = [];
  song: any[] = [];
  constructor(private route: ActivatedRoute,
    private historyListen: HistoryListensService,
    private dataGlobal: DataGlobalService,
    private firebaseStorage: FirebaseStorageCrudService,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.accountId = params['id'];

      // Sau khi lấy được accountId, bạn có thể sử dụng nó ở đây hoặc thực hiện các thao tác khác.
    });
    this.getLisByUserId();
  }

  getLisByUserId() {
    this.historyListen.getHisByUserId(this.accountId).subscribe((res) => {
      this.history = res;
      res.forEach(async (histo) => {
        this.song.push(histo.song)
      });



      res.forEach(async (his) => {
        his.song.image = await this.setImageURLFirebase(his.song.image);
      });
    })
  }

  async showDetail(item: any) {
    item.path = await this.setImageURLFirebase(item.path);
    this.dataGlobal.changeId(item);
    this.dataGlobal.setItem('songHeardLast', item);


  }

  async setImageURLFirebase(image: string): Promise<string> {
    if (image != null) {
      return await this.firebaseStorage.getFile(image);
    } else {
      return 'null';
    }
  }







}
