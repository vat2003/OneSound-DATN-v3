import {SongService} from '../../adminPage/adminEntityService/adminService/song.service';
import {Singer} from '../../adminPage/adminEntityService/adminEntity/singer/singer';
import {Song} from '../../adminPage/adminEntityService/adminEntity/song/song';
import {CommonModule, NgForOf} from '@angular/common';
import {account} from '../../adminPage/adminEntityService/adminEntity/account/account';
import {FavoriteService} from '../../../services/favorite-service/favorite.service';
import {accountServiceService} from '../../adminPage/adminEntityService/adminService/account-service.service';
import {FavoriteSong} from '../../adminPage/adminEntityService/adminEntity/favoriteYoutube/favorite-song';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {
  PlaylistInteractionService
} from '../../adminPage/adminEntityService/adminService/PlaylistInteractionService.service';
import {BehaviorSubject} from 'rxjs';
import {MatDialog} from "@angular/material/dialog";
import {UserPlaylistModalComponent} from "../user-playlist-modal/user-playlist-modal.component";
import {Component} from "@angular/core";
import {PlayListSongService} from "../../adminPage/adminEntityService/adminService/PlayListSongService.service";
import {PlaylistSong} from "../../adminPage/PlaylistSong/PlaylistSong";
import {playlistService} from "../../adminPage/adminEntityService/adminService/playlistService.service";
import {Playlist} from "../../adminPage/adminEntityService/adminEntity/Playlist/Playlist";

@Component({
  selector: 'app-user-song-in-playlist',
  standalone: true,
  imports: [NgForOf, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './user-song-in-playlist.component.html',
  styleUrl: './user-song-in-playlist.component.scss'
})
export class UserSongInPlaylistComponent {
  songsfromdata: PlaylistSong[] = [];
  songs: any[] = [];
  acc?: account | null;
  favListSongs: any[] = [];
  currentPlaylist?: Playlist;

  // songs: Song[] = [];
  constructor(
    private matDialog: MatDialog,
    private SongService: SongService,
    private PlaylistSongService: PlayListSongService,
    private PlaylistService: playlistService,
    private userService: accountServiceService,
    private favSong: FavoriteService, private songService: SongService
    , private playlistInteractionService: PlaylistInteractionService
  ) {
  }


  openDialog(songInput: Song) {
    const dialogRef = this.matDialog.open(UserPlaylistModalComponent, {
      data: {song: songInput}
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
    this.getPlaylist(64);
  }


  getAllSongs(): void {
    // this.SongService.getAllSongs().subscribe((data) => {
    //   this.songsfromdata = data;
    //   this.songs = this.songsfromdata;
    //
    //   console.log(this.songs);
    // });

    this.PlaylistSongService.getAllSongsInPlaylist(64).subscribe((data) => {
      this.songs = data;
      this.songsfromdata = data;
      console.log(data)
    })

  }

  getPlaylist(id: any) {
    this.PlaylistService.getPlaylistByid(id).subscribe((data) => {
      this.currentPlaylist = data;
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
      this.favSong.deleteFavoriteSong(favS).subscribe((data) => {
      });
    } else {
      song.isFav = true;
      this.favSong.addFavoriteSong(favS).subscribe((data) => {
      });
    }
  }

}
