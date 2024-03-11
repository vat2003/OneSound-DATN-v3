import {Component, Inject} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Song} from "../../adminPage/adminEntityService/adminEntity/song/song";

@Component({
  selector: 'app-user-playlist-modal-from-api',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './user-playlist-modal-from-api.component.html',
  styleUrl: './user-playlist-modal-from-api.component.scss'
})
export class UserPlaylistModalFromAPIComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { song: any }) {

  }
}
