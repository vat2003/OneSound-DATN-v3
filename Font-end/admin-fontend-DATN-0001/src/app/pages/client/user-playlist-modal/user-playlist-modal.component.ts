import {Component, Inject, NO_ERRORS_SCHEMA, OnInit} from '@angular/core';
import {FormControl, FormsModule} from "@angular/forms";
import {CommonModule, NgIf} from "@angular/common";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Song} from "../../adminPage/adminEntityService/adminEntity/song/song";
import {account} from "../../adminPage/adminEntityService/adminEntity/account/account";
import {accountServiceService} from "../../adminPage/adminEntityService/adminService/account-service.service";
import {Playlist} from '../../adminPage/PlaylistSong/Playlist';
import {playlistService} from '../../adminPage/adminEntityService/adminService/playlistService.service';
import {PlayListSongService} from '../../adminPage/adminEntityService/adminService/PlayListSongService.service';
import {PlaylistSong} from '../../adminPage/PlaylistSong/PlaylistSong';
import {
  PlaylistInteractionService
} from '../../adminPage/adminEntityService/adminService/PlaylistInteractionService.service';

@Component({
  selector: 'app-user-playlist-modal',
  standalone: true,
  imports: [
    CommonModule,
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
              private playlistInteractionService: PlaylistInteractionService,
  ) {
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }


  updatePlaylists(): void {
    debugger
    const userId = this.account?.id ?? 0;
    this.playlistService.getPlaylistsByUserId(userId).subscribe(
      (playlists: Playlist[]) => {
        debugger
        this.PlaylistTable = playlists;
        this.formcontrol.setValue('');
        playlists.forEach((playlist) => {
          debugger
          this.findSongPlaylist(playlist);
        });
      },
      (error) => {
        console.error('Error fetching playlists:', error);
      }
    );
  }

  findSongPlaylist(playlist: Playlist) {
    const playlistId = playlist.id ?? 0;
    this.playlistSongService.findSongInPlaylist(playlistId, this.currentSongId ?? 0).subscribe(
      (playlistSong: PlaylistSong) => {
        debugger
        this.playlistSongMap[playlistId] = playlistSong !== null;
      },
      (error) => {
        debugger
        console.error(`Error fetching song in playlist ${playlistId}:`, error);
      }
    );
  }


  ngOnInit(): void {
    this.playlistInteractionService.playlistUpdated$.subscribe(() => {
      this.updatePlaylists();
    });

    this.account = this.userService.getUserResponseFromLocalStorage();
    this.currentSongId = this.data.song.id;

    this.updatePlaylists();
  }


  addPlaySong(playlist: Playlist) {
    const playlistId: number | undefined = playlist.id;
    const songId: number | undefined = this.currentSongId;

    if (playlistId !== undefined && songId !== undefined) {
      debugger
      this.playlistSongService.addSongToPlaylist(playlistId, songId).subscribe(
        (Playlist: Playlist) => {
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


    this.playlistInteractionService.updatePlaylist();
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
    const playlist: Playlist = {
      name: this.playlistName,
      user_id: {
        id: this.account?.id || 0
      }
    };

    if (playlist.name == null) {
      alert("Vui lòng không để trống tên playlist");
    } else {
      this.playlistService.getPlaylistByName(playlist.name).subscribe(
        (existingPlaylist: Playlist | null) => {
          if (existingPlaylist) {
            alert("Tên playlist đã tồn tại, vui lòng nhập tên playlist khác");
          } else {
            this.playlistService.createPlaylist(playlist).subscribe(
              (createdPlaylist: Playlist) => {
                this.PlaylistTable.push(createdPlaylist);
                this.playlistName = '';
                console.log('Created Playlist Information:', createdPlaylist);

                this.playlistService.getPlaylistByid(createdPlaylist.id || 0).subscribe(
                  (fetchedPlaylist: Playlist | null) => {
                    if (fetchedPlaylist) {
                      console.log('Fetched Playlist Information:', fetchedPlaylist);

                      this.playlistSongService.addSongToPlaylist(fetchedPlaylist.id ?? 0, this.currentSongId ?? 0).subscribe(
                        () => {
                          debugger
                          console.log('Song added to playlist successfully.');
                          this.playlistSongMap[fetchedPlaylist.id ?? 0] = true;
                          this.playlistInteractionService.updatePlaylist();

                        },
                        (error) => {
                          debugger
                          console.error('Failed to add song to the playlist:', error);
                        }
                      );
                    } else {
                      console.error('Failed to fetch playlist information.');
                    }
                  },
                  (error) => {
                    console.error('Error fetching playlist information:', error);
                  }
                );
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
  }


  toggleAddRemove(playlist: Playlist): void {
    const playlistId = playlist.id;
    const songId = this.currentSongId;
    if (playlistId && songId) {
      const isSongInPlaylist = this.playlistSongMap[playlistId];
      if (!isSongInPlaylist) {
        this.playlistSongService.addSongToPlaylist(playlistId, songId).subscribe(
          () => {
            console.log('Song added to playlist successfully.');
            this.playlistSongMap[playlistId] = true;
            this.playlistInteractionService.updatePlaylist();
            this.timname(playlistId);
          },
          (error) => {
            console.error('Failed to add song to playlist:', error);
          }
        );
      }
      if (isSongInPlaylist) {
        this.playlistSongService.removeSongFromPlaylist(playlistId, songId).subscribe(
          () => {

            console.log('Song removed from playlist successfully.');
            this.playlistSongMap[playlistId] = false;
            // alert(this.playlistSongMap[playlistId])
            this.playlistInteractionService.updatePlaylist();
            this.timname(playlistId);
            this.findSongPlaylist(playlist);
          },
          (error) => {
            console.error('Failed to remove song from playlist:', error);
          }
        );
      }

    } else {
      console.error('Invalid playlistId or songId.');
    }

  }


}
