import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {account} from '../../adminPage/adminEntityService/adminEntity/account/account';
import {FavoriteService} from '../../../services/favorite-service/favorite.service';
import {accountServiceService} from '../../adminPage/adminEntityService/adminService/account-service.service';
import {FavoriteYoutbe} from '../../adminPage/adminEntityService/adminEntity/favoriteYoutube/favorite-youtbe';
import {FavoriteSong} from '../../adminPage/adminEntityService/adminEntity/favoriteYoutube/favorite-song';
import {DataGlobalService} from "../../../services/data-global.service";
import {FirebaseStorageCrudService} from "../../../services/firebase-storage-crud.service";
import {FavoriteAlbum} from "../../adminPage/adminEntityService/adminEntity/favoriteYoutube/favorite-album";
import {Album} from "../../adminPage/adminEntityService/adminEntity/album/album";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-favorite',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './user-favorite.component.html',
  styleUrl: './user-favorite.component.scss',
})
export class UserFavoriteComponent implements OnInit {
  acc?: account | null;

  favListSongs: any[] = [];
  favListYoutubes: any[] = [];
  favListAlbums: any[] = [];

  constructor(
    private userService: accountServiceService,
    private favYoutube: FavoriteService,
    private dataGlobal: DataGlobalService,
    private firebaseStorage: FirebaseStorageCrudService,
    private favAlbum: FavoriteService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.acc = this.userService.getUserResponseFromLocalStorage();
    this.getAllYoutubeFavByUser();
    this.getAllAlbumFavByUser();
  }

  async setImageURLFirebase(image: string): Promise<string> {
    if (image != null) {
      return await this.firebaseStorage.getFile(image);
    } else {
      return 'null';
    }
  }

  unlike(favAlbum: Album) {
    let favAlbum2 = new FavoriteAlbum(this.acc?.id, favAlbum.id);
    this.favAlbum.deleteFavoriteAlbum(favAlbum2).subscribe((data) => {
    });
    this.getAllAlbumFavByUser();
  }

  async showDetail(item: any) {
    item.path = await this.setImageURLFirebase(item.path);
    this.dataGlobal.changeId(item);
    this.dataGlobal.setItem('songHeardLast', item);
  }

  getAllYoutubeFavByUser() {
    if (this.acc && this.acc.id) {
      this.favYoutube.getAllFavYoutubeByUser(this.acc.id).subscribe((data) => {
        this.favListYoutubes = data;
        console.log('getAll Youtube FavByUser', this.favListYoutubes);
      });
      this.favYoutube.getAllFavSongByUser(this.acc.id).subscribe(async (data) => {
        this.favListSongs = data;
        for (const songs of this.favListSongs) {
          songs.song.image = await this.setImageURLFirebase(songs.song.image);
        }
        console.log('getAll Song FavByUser', this.favListSongs);
      });
    }
  }
  gotoDetailAlbum(album: Album): void {
    this.router.navigate(['/onesound/home/album/', album.id]);
  }
  getAllAlbumFavByUser() {
    if (this.acc && this.acc.id) {
      this.favAlbum.getAllFavAlbumByUser(this.acc.id).subscribe((data) => {
        this.favListAlbums = data;
        this.favListAlbums.forEach((album) => {
          album.album.image = this.setImageURLFirebase(album.album.image);
        })
        console.log('albun', data)
      })
    }
  }

  deleFavYoutube(yt: any) {
    let favyt = new FavoriteYoutbe(this.acc?.id, yt.youtube.id);
    if (confirm('You definitely want to unlike this song')) {
      const index = this.favListYoutubes.indexOf(yt);
      if (index !== -1) {
        this.favListYoutubes.splice(index, 1);
        this.favYoutube.deleteFavoriteYoutube(favyt).subscribe((data) => {
        });
      }
    }
  }

  deleFavSong(song: any) {
    let songId = song.song.id;
    let favS = new FavoriteSong(this.acc?.id, songId);

    if (confirm('You definitely want to unlike this song')) {
      const index = this.favListSongs.indexOf(song);
      if (index !== -1) {
        this.favListSongs.splice(index, 1);
        this.favYoutube.deleteFavoriteSong(favS).subscribe((data) => {
        });
      }
    }
  }
}
