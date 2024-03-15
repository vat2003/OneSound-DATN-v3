import {Component, OnInit, signal} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {UserPlaylistModalComponent} from '../user-playlist-modal/user-playlist-modal.component';
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
import {Playlist} from "../../adminPage/adminEntityService/adminEntity/Playlist/Playlist";
import {playlistService} from "../../adminPage/adminEntityService/adminService/playlistService.service";
import {Router, RouterLink} from "@angular/router";

@Component({
  selector: 'app-user-playlist-form',
  standalone: true,
  imports: [NgForOf, HttpClientModule, CommonModule, FormsModule, RouterLink],
  templateUrl: './user-playlist-form.component.html',
  styleUrl: './user-playlist-form.component.scss'
})
export class UserPlaylistFormComponent {
  acc?: account | null;
  playlists: Playlist[] = [];

  constructor(
    private userService: accountServiceService,
    private PlaylistService: playlistService,
    private router: Router,
  ) {
  }

  openSongList(id: any) {
    this.router.navigate(['onesound/signup']);
  }

  ngOnInit(): void {
    this.acc = this.userService.getUserResponseFromLocalStorage();
    this.getPlaylist();
  }

  getPlaylist(): void {
    this.PlaylistService.getByUser(this.acc?.id).subscribe((data) => {
      this.playlists = data;
      console.log(this.playlists)
    });
  }

}
