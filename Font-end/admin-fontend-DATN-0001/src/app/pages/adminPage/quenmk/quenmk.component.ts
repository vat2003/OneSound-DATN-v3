import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import {Router} from "@angular/router";
import {accountServiceService} from "../adminEntityService/adminService/account-service.service";
import {TokenService} from "../adminEntityService/adminService/token.service";

@Component({
  selector: 'app-quenmk',
  styleUrls: ['./quenmk.component.scss'],
  templateUrl: './quenmk.component.html',
  standalone: true,
  imports: [
    FormsModule,
  ],
})
export class QuenmkComponent {
  @ViewChild('loginForm') loginForm!: NgForm;
  email: string = '';

  constructor(private router: Router,
              private userService: accountServiceService,
              private tokenService: TokenService,
  ) {
  }

  Quenmk() {
    debugger
    alert(this.email);


    this.userService.guimail1(this.email).subscribe({

      next: (response: any) => {
        debugger
        alert("gui thanh cong" + response);
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {
        debugger
        alert("profile thất bại" + error);
        console.log(error);
      }
    });
  }
}
