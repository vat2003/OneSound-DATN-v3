import {Component, Inject, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Song} from "../../adminPage/adminEntityService/adminEntity/song/song";

@Component({
  selector: 'app-user-playlist-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './user-playlist-modal.component.html',
  styleUrl: './user-playlist-modal.component.scss'
})
export class UserPlaylistModalComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { song: Song }) {
  }


  ngOnInit(): void {
    console.log(this.data.song.name)
  }


}
