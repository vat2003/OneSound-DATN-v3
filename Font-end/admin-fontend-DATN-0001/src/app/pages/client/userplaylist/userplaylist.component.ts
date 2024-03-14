// import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
// import { playlistService } from '../../adminPage/adminEntityService/adminService/playlistService.service';
// import { PlayListSongService } from '../../adminPage/adminEntityService/adminService/PlayListSongService.service';
// import { Playlist } from '../../adminPage/PlaylistSong/Playlist';
// import { CommonModule, NgIf } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { account } from '../../adminPage/adminEntityService/adminEntity/account/account';
// import { accountServiceService } from '../../adminPage/adminEntityService/adminService/account-service.service';

// @Component({
//   selector: 'app-userplaylist',
//   templateUrl: './userplaylist.component.html',
//   standalone: true,
//   imports: [
//     CommonModule, 
//     NgIf
//   ],
//   styleUrls: ['./userplaylist.component.scss']
// })
// export class UserplaylistComponent implements OnInit {
//   Playlist: Playlist[] = [];
//   account?: account | null;



//   constructor(
//     private playlistService: playlistService,
//     private playlistSongService: PlayListSongService,
//     private router: Router,
//     private cdr: ChangeDetectorRef,
//     private userService: accountServiceService,

//   ) { }

//   ngOnInit(): void {
//     this.getAllSongs();
//   }

//   getAllSongs(): void {
//     this.account = this.userService.getUserResponseFromLocalStorage();
//     this.playlistService.getPlaylistsByUserId(this.account?.id ?? 0).subscribe(
//       (playlists: Playlist[]) => {
//         this.Playlist = playlists;
//         console.log(this.Playlist);
     
//       },
//       (error) => {                
//         console.error('Error fetching songs from the playlist:', error);
//       }
//     );
//   }

//   deletePlayList(playlist: Playlist): void {    
//     this.playlistSongService.removePlaylist(playlist.id ?? 0).subscribe(
//       () => {          
//         window.location.reload();
//       },
//       (error) => {
//         console.error('Failed to remove song from playlist:', error);
//       }
//     );     
    
//   }
// }

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Playlist } from '../../adminPage/PlaylistSong/Playlist';
import { CommonModule, NgIf } from '@angular/common';
import { account } from '../../adminPage/adminEntityService/adminEntity/account/account';
import { accountServiceService } from '../../adminPage/adminEntityService/adminService/account-service.service';
import { playlistService } from '../../adminPage/adminEntityService/adminService/playlistService.service';
import { PlayListSongService } from '../../adminPage/adminEntityService/adminService/PlayListSongService.service';

@Component({
  selector: 'app-userplaylist',
    standalone: true,
  imports: [
    CommonModule, 
    NgIf
  ],
  templateUrl: './userplaylist.component.html',
  styleUrls: ['./userplaylist.component.scss']
})
export class UserplaylistComponent implements OnInit {
  playlists: Playlist[] = [];
  account?: account | null;

  constructor(
    private playlistService: playlistService,
    private playlistSongService: PlayListSongService,
    private cdr: ChangeDetectorRef,
    private userService: accountServiceService,
  ) { }

  ngOnInit(): void {
    this.getAllPlaylists();
  }

  getAllPlaylists(): void {
    this.account = this.userService.getUserResponseFromLocalStorage();
    this.playlistService.getPlaylistsByUserId(this.account?.id ?? 0).subscribe(
      (playlists: Playlist[]) => {
        this.playlists = playlists;
        console.log(this.playlists);
      },
      (error) => {                
        console.error('Error fetching playlists:', error);
      }
    );
  }

  deletePlaylist(playlist: Playlist): void {    
    this.playlistSongService.removePlaylist(playlist.id ?? 0).subscribe(
      () => {          
        this.playlists = this.playlists.filter(p => p.id !== playlist.id);
        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Failed to remove playlist:', error);
      }
    );     
  }
}

