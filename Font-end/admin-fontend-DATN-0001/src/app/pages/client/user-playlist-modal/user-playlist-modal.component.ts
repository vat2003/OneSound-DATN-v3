
import { Component, Inject, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { FormControl, FormsModule } from "@angular/forms";
import { CommonModule, NgIf } from "@angular/common";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Song } from "../../adminPage/adminEntityService/adminEntity/song/song";
import { account } from "../../adminPage/adminEntityService/adminEntity/account/account";
import { accountServiceService } from "../../adminPage/adminEntityService/adminService/account-service.service";
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Playlist } from '../../adminPage/PlaylistSong/Playlist';
import { playlistService } from '../../adminPage/adminEntityService/adminService/playlistService.service';
import { PlayListSongService } from '../../adminPage/adminEntityService/adminService/PlayListSongService.service';
import { PlaylistSong } from '../../adminPage/PlaylistSong/PlaylistSong';

@Component({
  selector: 'app-user-playlist-modal',
  standalone: true,
  imports: [
    CommonModule, // Add this line to import CommonModule
    FormsModule,
    NgIf
  ],
  templateUrl: './user-playlist-modal.component.html',
  styleUrl: './user-playlist-modal.component.scss',
  schemas: [NO_ERRORS_SCHEMA]
})
export class UserPlaylistModalComponent implements OnInit {
  account?: account | null;
  formcontrol = new FormControl('');
  PlaylistTable: Playlist[] = [];
  PlaylistSongTable: PlaylistSong[] = [];
  showForm = false;
  currentSongId: number | undefined; 
  songsInPlaylist: any[] = [];
  playlistName: string = '';
  playlistSongMap: { [playlistId: number]: boolean } = {};


  

  constructor(@Inject(MAT_DIALOG_DATA) public data: { song: Song },
              private userService: accountServiceService,
              private playlistService: playlistService,
              private playlistSongService: PlayListSongService,
  ) {
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }




  ngOnInit(): void {
    this.account = this.userService.getUserResponseFromLocalStorage();
    this.currentSongId = this.data.song.id;
    this.playlistService.getPlaylistsByUserId(this.account?.id ?? 0).subscribe(
      (playlists: Playlist[]) => {
        this.PlaylistTable = playlists;
        this.formcontrol.setValue('');        
        playlists.forEach((playlist) => {
          if (playlist.id !== undefined) {
            this.playlistSongService.findSongInPlaylist(playlist.id, this.currentSongId ?? 0).subscribe(
              (playlistSong: PlaylistSong) => {
                this.playlistSongMap[playlist.id ?? 0] = playlistSong !== null;
              },
              (error) => {
                console.error(`Error fetching song in playlist ${playlist.id}:`, error);
              }
            );
          }
        });
        
      },
      (error) => {
        console.error('Error fetching songs from the playlist:', error);
      }
    );
  }
  
  

  addPlaySong(playlist: Playlist) {
  
    const playlistId: number | undefined = playlist.id;
    const songId: number | undefined = this.currentSongId;
  
    // Check if playlistId and songId are defined before proceeding
    if (playlistId !== undefined && songId !== undefined) {
      
      this.playlistSongService.addSongToPlaylist(playlistId, songId).subscribe(
        () => 
        {
          console.log('Song added to playlist successfully.');
        },
        error => {
          
          console.error('Failed to add song to the playlist:', error);
        }
      );
    } else {
      
      console.error('Invalid playlistId or songId.');
    }
  }

  timname(id: number | undefined) {
    debugger
    if (id !== undefined) {
      debugger
      this.playlistSongService.getAllSongsInPlaylist(id).subscribe(
        (songs: any[]) => {
          debugger
          this.songsInPlaylist = songs;
          console.log('Songs in playlist:', this.songsInPlaylist);
        },
        error => {
          debugger
          console.error('Failed to fetch songs from the playlist:', error);
        }
      );
    } else {
      debugger
      console.error('Playlist ID is undefined.');
    }
  }


  Playlist(): void {
    this.account = this.userService.getUserResponseFromLocalStorage();

    debugger
    const Playlist: Playlist = {
      name: this.playlistName,
      user_id: {
        id: this.account?.id || 0
      }
    };
    debugger
    this.playlistService.createPlaylist(Playlist)
      .subscribe(
        
        (createdPlaylist: Playlist) => {
          debugger
          console.log('Playlist created successfully:', createdPlaylist);
          // Handle success here, if needed
        },
        (error) => {
          debugger
          console.error('Error creating playlist:', error);
          // Handle error here, if needed
        }
      );
  }



 
 
  
  
  
  
  

  
}
