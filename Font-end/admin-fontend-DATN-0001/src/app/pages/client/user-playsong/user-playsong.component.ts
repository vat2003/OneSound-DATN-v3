import {Component, OnInit, signal} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {UserPlaylistModalComponent} from "../user-playlist-modal/user-playlist-modal.component";
import {SongService} from "../../adminPage/adminEntityService/adminService/song.service";
import {Singer} from "../../adminPage/adminEntityService/adminEntity/singer/singer";
import {Song} from "../../adminPage/adminEntityService/adminEntity/song/song";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-user-playsong',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './user-playsong.component.html',
  styleUrl: './user-playsong.component.scss'
})
export class UserPlaysongComponent implements OnInit {
  songs: Song[] = [];

  constructor(private matDialog: MatDialog,
              private SongService: SongService
  ) {
  }

  openDialog(songInput: Song) {
    const dialogRef = this.matDialog.open(UserPlaylistModalComponent, {
      // width: '350px',
      data: {song: songInput} // Truyền ID vào data
    });
  }

  ngOnInit(): void {
    this.getAllSongs();
  }

  getAllSongs(): void {
    this.SongService.getAllSongs().subscribe((data) => {
      this.songs = data;
      console.log(this.songs)
    });
  }

}
