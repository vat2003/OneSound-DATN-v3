import { Component, OnInit } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import { account } from '../adminEntityService/adminEntity/account/account';
import { TokenService } from '../adminEntityService/adminService/token.service';
import { accountServiceService } from '../adminEntityService/adminService/account-service.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  account?:account | null;

  constructor(
    private UserService: accountServiceService,
    private tokenService: TokenService,
    private router: Router,
  ) {

  }
  ngOnInit() {
    this.account = this.UserService.getUserResponseFromLocalStorage();

    console.log(this.account);
  }

  logout(){
    this.UserService.removeUserFromLocalStorage();
  }
  profile(){
    this.router.navigate(['/onesound/admin/manage/profile']);
  }
}
