import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SingerService } from '../../adminPage/adminEntityService/adminService/singer-service.service';
import { Singer } from '../../adminPage/adminEntityService/adminEntity/singer/singer';
import { FirebaseStorageCrudService } from '../../../services/firebase-storage-crud.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  id!: number;
  singer: Singer = new Singer();
  constructor(
    private route: ActivatedRoute,
    private singerService: SingerService,
    private firebaseStorage: FirebaseStorageCrudService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    alert(this.id)
    this.loadSinger();
  }
  // private getSingerById() {
  //   this.singerService.getArtistById(this.id).subscribe(
  //     (data) => {
  //       this.singer = data;
  //     },
  //     (error) => console.log(error)
  //   );
  // }

  getSingerById(): void {
    this.singerService.getArtistById(this.id).subscribe(async (data) => {
      this.singer = data;

      debugger;
      console.log(data);
      this.singer = data;

      this.singer.image = await this.setImageURLFirebase(this.singer.image);

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

  private loadSinger() {
    this.getSingerById();
  }
}
