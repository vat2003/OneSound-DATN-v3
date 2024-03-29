import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from "@angular/router";
import { account } from '../adminEntityService/adminEntity/account/account';
import { TokenService } from '../adminEntityService/adminService/token.service';
import { accountServiceService } from '../adminEntityService/adminService/account-service.service';
import { FirebaseStorageCrudService } from "../../../services/firebase-storage-crud.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  account?: account | null;
  x: any;

  constructor(
    private UserService: accountServiceService,
    private tokenService: TokenService,
    private router: Router,
    private firebaseStorage: FirebaseStorageCrudService,
  ) {

  }

  ngOnInit() {
    this.account = this.UserService.getUserResponseFromLocalStorage();
    console.log(this.account);
  }

  async setImageURLFirebase(image: string | undefined): Promise<string> {
    if (image != null) {
      return await this.firebaseStorage.getFile(image);
    } else {
      return 'null';
    }
  }

  logout() {
    this.UserService.removeUserFromLocalStorage();
    this.router.navigate(['/onesound/signin']);
  }

  profile() {
    this.router.navigate(['/onesound/admin/manage/profile']);
  }

  toggleDropdown() {
    const dropdown = document.getElementById("myDropdown") as HTMLElement;
    if (dropdown.style.display === "block") {
      dropdown.style.display = "none";
    } else {
      dropdown.style.display = "block";
    }
  }

}
