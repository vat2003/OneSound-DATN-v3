import {Component, Inject, OnInit} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Song} from "../../adminPage/adminEntityService/adminEntity/song/song";
import {account} from "../../adminPage/adminEntityService/adminEntity/account/account";
import {accountServiceService} from "../../adminPage/adminEntityService/adminService/account-service.service";

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
  account?: account | null;
  constructor(@Inject(MAT_DIALOG_DATA) public data: { song: Song },
              private userService: accountServiceService,
  ) {
  }


  ngOnInit(): void {
    this.account = this.userService.getUserResponseFromLocalStorage();
    console.log(this.data.song.name)
  }


}
