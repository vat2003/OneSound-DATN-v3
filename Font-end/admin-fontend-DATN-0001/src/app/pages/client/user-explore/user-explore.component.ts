import { Component, OnInit } from '@angular/core';
import { SingerService } from '../../adminPage/adminEntityService/adminService/singer-service.service';
import { Singer } from '../../adminPage/adminEntityService/adminEntity/singer/singer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseStorageCrudService } from '../../../services/firebase-storage-crud.service';
import { Router } from '@angular/router';
import { StaticticalService } from '../../adminPage/adminEntityService/adminService/statictical/statictical.service';
import { error } from 'console';

@Component({
  selector: 'app-user-explore',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-explore.component.html',
  styleUrl: './user-explore.component.scss',
})
export class UserExploreComponent implements OnInit {
  hotArtist: Singer[] = [];
  constructor(
    private SingerService: SingerService,
    private firebaseStorage: FirebaseStorageCrudService,
    private router: Router,
    private statisticsService: StaticticalService
  ) { }
  index: number = 0;
  ngOnInit(): void {
    this.getAllArtist();
    this.recordVisit()
  }



  recordVisit() {
    this.statisticsService.recordVisit().subscribe((res) => {
      console.log(res);

    }, error => {
      console.log('error record visit ');

    }
    )
  }



  getAllArtist(): void {
    this.SingerService.getAllArtists().subscribe(async (data) => {
      this.hotArtist = data;
      console.log(this.hotArtist);
      console.log(data);
      this.hotArtist = data;

      for (const hotArt of this.hotArtist) {
        if (hotArt.image == null || hotArt.image == '') {
          continue;
        }
        hotArt.image = await this.setImageURLFirebase(hotArt.image);
      }
      // console.log(data);
    });
  }
  async setImageURLFirebase(image: string): Promise<string> {
    if (image != null) {
      return await this.firebaseStorage.getFile(image);
    } else {
      return 'null';
    }
  }
  gotoDetailArtist(artist: Singer): void {
    this.router.navigate(['/onesound/home/profile/', artist.id]);
  }
}
