import { Component, OnInit } from '@angular/core';
import { SingerService } from '../../adminPage/adminEntityService/adminService/singer-service.service';
import { Singer } from '../../adminPage/adminEntityService/adminEntity/singer/singer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseStorageCrudService } from '../../../services/firebase-storage-crud.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) {}
  ngOnInit(): void {
    this.getAllArtist();
  }

  getAllArtist(): void {
    this.SingerService.getAllArtists().subscribe(async (data) => {
      this.hotArtist = data;
      console.log(this.hotArtist);

      debugger;
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
