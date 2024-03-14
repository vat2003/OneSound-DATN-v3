import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserPlaylistModalComponent } from '../user-playlist-modal/user-playlist-modal.component';
import { SongService } from '../../adminPage/adminEntityService/adminService/song.service';
import { Singer } from '../../adminPage/adminEntityService/adminEntity/singer/singer';
import { Song } from '../../adminPage/adminEntityService/adminEntity/song/song';
import { CommonModule, NgForOf } from '@angular/common';
import { account } from '../../adminPage/adminEntityService/adminEntity/account/account';
import { FavoriteService } from '../../../services/favorite-service/favorite.service';
import { accountServiceService } from '../../adminPage/adminEntityService/adminService/account-service.service';
import { FavoriteSong } from '../../adminPage/adminEntityService/adminEntity/favoriteYoutube/favorite-song';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PlaylistInteractionService } from '../../adminPage/adminEntityService/adminService/PlaylistInteractionService.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-user-playsong',
  standalone: true,
  imports: [NgForOf, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './user-playsong.component.html',
  styleUrl: './user-playsong.component.scss',
})
export class UserPlaysongComponent implements OnInit {
  songsfromdata: Song[] = [];
  songs: any[] = [];
  acc?: account | null;
  favListSongs: any[] = [];
  // songs: Song[] = [];
  constructor(
    private matDialog: MatDialog,
    private SongService: SongService,
    private userService: accountServiceService,
    private favSong: FavoriteService, private songService: SongService
    , private playlistInteractionService: PlaylistInteractionService
  ) {}


  openDialog(songInput: Song) {
    const dialogRef = this.matDialog.open(UserPlaylistModalComponent, {
      data: { song: songInput }
    });

    dialogRef.afterOpened().subscribe(() => {
      this.getAllSongs();

    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  ngOnInit(): void {
    this.acc = this.userService.getUserResponseFromLocalStorage();
    this.getAllSongs();
    this.getAllSongFavByUser();
  }



  getAllSongs(): void {
    this.SongService.getAllSongs().subscribe((data) => {
      this.songsfromdata = data;
      this.songs = this.songsfromdata;

      console.log(this.songs);
    });
  }
  getAllSongFavByUser() {
    if (this.acc && this.acc.id) {
      this.favSong.getAllFavSongByUser(this.acc.id).subscribe((data) => {
        this.favListSongs = data;
        // console.log(this.favListSongs);

        this.checkFav();
      });
    }
  }
  checkFav() {
    for (let song of this.songs) {
      let found = this.favListSongs.find((fav) => fav.song.id === song.id);
      // Nếu tồn tại, gán isFav = true, ngược lại gán isFav = false
      song.isFav = found ? true : false;
    }
  }
  favoriteSong(song: any) {
    // alert(song.id);
    let songId = song.id;
    let favS = new FavoriteSong(this.acc?.id, songId);
    if (
      this.acc == null ||
      this.acc == undefined ||
      this.acc === null ||
      this.acc === undefined
    ) {
      alert('Please log in to use this feature');
      return;
    }
    if (song.isFav) {
      if (!confirm('Are you sure you want to unlike?')) {
        return;
      }
      song.isFav = false;
      this.favSong.deleteFavoriteSong(favS).subscribe((data) => {});
    } else {
      song.isFav = true;
      this.favSong.addFavoriteSong(favS).subscribe((data) => {});
    }
  }

}

