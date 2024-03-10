import { Component, Inject, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Youtube } from '../../adminPage/adminEntityService/adminEntity/DTO/youtube';
import { account } from '../../adminPage/adminEntityService/adminEntity/account/account';
import { accountServiceService } from '../../adminPage/adminEntityService/adminService/account-service.service';
import { playlistService } from '../../adminPage/adminEntityService/adminService/playlistService.service';
import { FormControl, FormsModule } from '@angular/forms';
import { Playlist } from '../../adminPage/PlaylistSong/Playlist';
import { CommonModule, NgIf } from '@angular/common';
import { PlayListSongService } from '../../adminPage/adminEntityService/adminService/PlayListSongService.service';
import { PlaylistYoutubeService } from '../../adminPage/adminEntityService/adminService/PlaylistYoutubeService.service';
import { PlaylistYoutube } from '../../adminPage/adminEntityService/adminEntity/DTO/PlaylistYoutube';

@Component({
  selector: 'app-user-playlist-youtube-modal-component',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    NgIf
  ],
  templateUrl: './user-playlist-youtube-modal-component.component.html',
  styleUrls: ['./user-playlist-youtube-modal-component.component.scss'],
  schemas: [NO_ERRORS_SCHEMA]

})
export class UserPlaylistYoutubeModalComponentComponent implements OnInit {
  account?: account | null;
  formcontrol = new FormControl('');
  PlaylistTable: Playlist[] = [];
  showForm = false;
  songsInPlaylist: any[] = [];
  playlistName: string = '';
  playlistSongMap: { [playlistId: number]: boolean } = {};
  currentSongId: string | undefined; 


  constructor(@Inject(MAT_DIALOG_DATA) public data: { youtubeId: string },
  private userService: accountServiceService,
  private playlistService: playlistService,
  private playlistSongService: PlayListSongService,
  private PlaylistYoutubeService: PlaylistYoutubeService,


  ) {}


  addPlaylistYoutube(playlist: Playlist){
    debugger
    const playlistId: number | undefined = playlist.id;
    const YoutubeId: string | undefined = this.data.youtubeId;
    debugger
    // Check if playlistId and songId are defined before proceeding
    if (playlistId !== undefined && YoutubeId !== undefined) {
      debugger
      this.PlaylistYoutubeService.addYoutubeToPlaylist(playlistId, YoutubeId).subscribe(
        () => 
        {
          debugger
          console.log('Song added to playlist successfully.');
        },
        error => {
          debugger
          console.error('Failed to add song to the playlist:', error);
        }
      );
    } else {
      debugger
      console.error('Invalid playlistId or songId.');
    }
  }
  removePlaylistYoutube(playlistId: number, YoutubeId: string): void{
    this.PlaylistYoutubeService.removeYoutubeFromPlaylist(playlistId, YoutubeId).subscribe(
      () => {
        console.log('Song removed from playlist successfully.');
        // Handle success here, if needed
      },
      (error) => {
        console.error('Failed to remove song from playlist:', error);
        // Handle error here, if needed
      }
    );
  }

 

  ngOnInit(): void {
    this.account = this.userService.getUserResponseFromLocalStorage();
    this.currentSongId = this.data.youtubeId;

    this.playlistService.getPlaylistsByUserId(this.account?.id ?? 0).subscribe(
      (playlists: Playlist[]) => {
        this.PlaylistTable = playlists;
        this.formcontrol.setValue('');  

        playlists.forEach((playlist) => {
          if (playlist.id !== undefined) {
            this.PlaylistYoutubeService.findYoutubeInPlaylist(playlist.id, this.currentSongId || '').subscribe(
              (PlaylistYoutube: PlaylistYoutube) => {
                this.playlistSongMap[playlist.id ?? 0] = PlaylistYoutube !== null;
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

  toggleForm() {
    this.showForm = !this.showForm;
  }
  timname(id: number | undefined) {
    debugger
    if (id !== undefined) {
      debugger
      this.PlaylistYoutubeService.getListPlaylistYoutubeid(id).subscribe(
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
    const playlist: Playlist = {
        name: this.playlistName,
        user_id: {
            id: this.account?.id || 0
        }
    };

    this.playlistService.getPlaylistByName(playlist.name)
        .subscribe(
            (existingPlaylist: Playlist | null) => {
                if (existingPlaylist) {
                    alert("tên playlist đã tồn tại , xin hãy nhập tên playlist khác")
                } else {
                    this.playlistService.createPlaylist(playlist)
                        .subscribe(
                            (createdPlaylist: Playlist) => {
                                console.log('Playlist created successfully:', createdPlaylist);
                            },
                            (error) => {
                                console.error('Error creating playlist:', error);
                            }
                        );
                }
            },
            (error) => {
                console.error('Error checking playlist name:', error);
            }
        );
}

deletePlayList(playlist: Playlist): void {
  this.playlistSongService.removePlaylist(playlist.id ?? 0).subscribe(
    () => {
      console.log('Song removed from playlist successfully.');
    },
    (error) => {
      console.error('Failed to remove song from playlist:', error);
    }
  );
}
}
