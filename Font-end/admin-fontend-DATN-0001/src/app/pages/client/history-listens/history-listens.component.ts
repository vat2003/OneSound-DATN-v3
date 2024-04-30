import { Component } from '@angular/core';
import bootstrap from '../../../../main.server';
import { ActivatedRoute } from '@angular/router';
import { HistoryListensService } from '../../../services/history-listens/history-listens.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataGlobalService } from '../../../services/data-global.service';
import { FirebaseStorageCrudService } from '../../../services/firebase-storage-crud.service';
import { account } from '../../adminPage/adminEntityService/adminEntity/account/account';
import { accountServiceService } from '../../adminPage/adminEntityService/adminService/account-service.service';

@Component({
  selector: 'app-history-listens',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './history-listens.component.html',
  styleUrl: './history-listens.component.css'
})
export class HistoryListensComponent {

  accountId!: number;
  history: any[] = [];
  song: any[] = [];
  acc!: account | null;
  historyDel: any[] = [];
  constructor(private route: ActivatedRoute,
    private historyListen: HistoryListensService,
    private dataGlobal: DataGlobalService,
    private firebaseStorage: FirebaseStorageCrudService,
    private userService: accountServiceService
  ) {
  }

  ngOnInit(): void {
    this.acc = this.userService.getUserResponseFromLocalStorage();
    this.route.params.subscribe(params => {
      this.accountId = params['id'];

      // Sau khi lấy được accountId, bạn có thể sử dụng nó ở đây hoặc thực hiện các thao tác khác.
    });
    this.getLisByUserId();

  }

  getLisByUserId() {
    this.historyListen.getHisByUserId(this.accountId).subscribe((res) => {
      this.history = res;
      console.log('likq', this.history)
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

  deleteHis() {
    const id = this.acc?.id;
    const isConfirmed = window.confirm('Are you sure you want to delete all history?');
    if (isConfirmed) {
      this.historyListen.deleteAllHistory(id).subscribe(() => {
        this.getLisByUserId();
      })
    }
  }

  updateSelectedHistories(item: any) {
    if (item.selected) {
      this.historyDel.push(item);
    } else {
      this.historyDel = this.historyDel.filter(h => h !== item);
    }
  }

  deleteSelectedHistories() {
    const idsToDelete = this.historyDel.map(h => h.id);
    idsToDelete.forEach(id => {
      this.historyListen.deleteLisHis(id).subscribe({
        next: () => {
          console.log(`History with id ${id} deleted successfully`);
          this.history = this.history.filter(item => item.id !== id);
        },
        error: err => {
          console.error('Error deleting history: ', err);
        },
        complete: () => {
          // This callback doesn't need to do anything here but is available if needed
        }
      });
    });
    this.historyDel = [];
  }

  toggleAll() {
    const allChecked = this.allSelected();
    this.history.forEach(item => {
      item.selected = !allChecked;
      this.updateSelectedHistories(item);
    });
  }

  allSelected(): boolean {
    return this.history.every(item => item.selected);
  }


}
