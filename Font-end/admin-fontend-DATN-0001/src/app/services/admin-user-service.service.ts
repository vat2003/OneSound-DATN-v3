import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AdminUserServiceService {

  constructor() { }

  isAdmin = false; // Set initial value

  setAdminMode(isAdmin: boolean) {
    this.isAdmin = isAdmin;
  }
}
