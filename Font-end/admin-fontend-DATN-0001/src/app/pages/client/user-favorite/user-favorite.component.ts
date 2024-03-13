import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { account } from '../../adminPage/adminEntityService/adminEntity/account/account';
import { FavoriteService } from '../../../services/favorite-service/favorite.service';
import { accountServiceService } from '../../adminPage/adminEntityService/adminService/account-service.service';
import { FavoriteYoutbe } from '../../adminPage/adminEntityService/adminEntity/favoriteYoutube/favorite-youtbe';
import { FavoriteSong } from '../../adminPage/adminEntityService/adminEntity/favoriteYoutube/favorite-song';

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
    private favYoutube: FavoriteService
  ) {}
  ngOnInit(): void {
    this.acc = this.userService.getUserResponseFromLocalStorage();
    this.getAllYoutubeFavByUser();
  }

  getAllYoutubeFavByUser() {
    if (this.acc && this.acc.id) {
      this.favYoutube.getAllFavYoutubeByUser(this.acc.id).subscribe((data) => {
        this.favListYoutubes = data;
        console.log('getAll Youtube FavByUser', this.favListYoutubes);
      });
      this.favYoutube.getAllFavSongByUser(this.acc.id).subscribe((data) => {
        this.favListSongs = data;
        console.log('getAll Song FavByUser', this.favListSongs);
      });
    }
  }

  deleFavYoutube(yt: any) {
    let favyt = new FavoriteYoutbe(this.acc?.id, yt.youtube.id);
    if (confirm('You definitely want to unlike this song')) {
      const index = this.favListYoutubes.indexOf(yt);
      if (index !== -1) {
        this.favListYoutubes.splice(index, 1);
        this.favYoutube.deleteFavoriteYoutube(favyt).subscribe((data) => {});
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
        this.favYoutube.deleteFavoriteSong(favS).subscribe((data) => {});
      }
    }
  }
}
