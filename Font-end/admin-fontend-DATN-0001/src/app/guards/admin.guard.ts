import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateFn } from '@angular/router';
import { Router } from '@angular/router'; // Đảm bảo bạn đã import Router ở đây.
import { inject } from '@angular/core';
import { of,Observable } from 'rxjs';

import { TokenService } from '../pages/adminPage/adminEntityService/adminService/token.service';
import { accountServiceService } from '../pages/adminPage/adminEntityService/adminService/account-service.service';
import { account } from '../pages/adminPage/adminEntityService/adminEntity/account/account';

// @Injectable({
//   providedIn: 'root'
// })
// export class AdminGuard {
//   account?:account | null;
//   constructor(
//     private tokenService: TokenService,
//     private router: Router,
//     private accountServiceService:accountServiceService
//   ) {}

//   canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//     debugger
//     const isTokenExpired = this.tokenService.isTokenExpired();
//     const isUserIdValid = this.tokenService.getUserId() > 0;
//     this.account = this.accountServiceService.getUserResponseFromLocalStorage();
//     const isAdmin = this.account?.accountRole?.name === 'admin';
//     const isAstaff = this.account?.accountRole?.name === 'staff';

//     debugger
//     if (isAdmin || isAstaff) {
//       debugger
//       return true;
//     } else {
//       debugger
//       alert("Không phải là admin hoặc staff, xin hãy đăng nhập")
//       this.router.navigate(['/onesound/signin']);
//       return false;
//     }
// }

// }

// export const AdminGuardFn: CanActivateFn = (
//   next: ActivatedRouteSnapshot,
//   state: RouterStateSnapshot
// ): boolean => {

//   return inject(AdminGuard).canActivate(next, state);
// }


@Injectable({
  providedIn: 'root'
})
export class AdminGuard {
  account?: account | null;
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private accountServiceService: accountServiceService
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    debugger
    const isTokenExpired = this.tokenService.isTokenExpired();
    const isUserIdValid = this.tokenService.getUserId() > 0;
    this.account = this.accountServiceService.getUserResponseFromLocalStorage();
    const isAdmin = this.account?.accountRole?.name === 'admin';
    const isAstaff = this.account?.accountRole?.name === 'staff';

    if (isAdmin || isAstaff) {
      debugger
      return true;
    } else {debugger
      alert("Not an admin or employee, please log in");
      this.router.navigate(['/onesound/signin']);
      return false;
    }
  }
}

export const AdminGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  return inject(AdminGuard).canActivate(next, state);
}
