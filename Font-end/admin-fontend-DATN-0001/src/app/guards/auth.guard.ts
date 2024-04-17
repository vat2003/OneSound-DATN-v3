import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateFn,
} from '@angular/router';
import {Router} from '@angular/router'; // Đảm bảo bạn đã import Router ở đây.
import {inject} from '@angular/core';
import {TokenService} from '../pages/adminPage/adminEntityService/adminService/token.service';
import { accountServiceService } from '../pages/adminPage/adminEntityService/adminService/account-service.service';
import { account } from '../pages/adminPage/adminEntityService/adminEntity/account/account';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  account?: account | null;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private accountServiceService: accountServiceService
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    const isTokenExpired = this.tokenService.isTokenExpired();
    const isUserIdValid = this.tokenService.getUserId() > 0;
    this.account = this.accountServiceService.getUserResponseFromLocalStorage();
    const aaa = this.account?.accountRole?.name === 'user';
    if (aaa) {
      return true;
    } else {
      alert("You must be logged in to use this function");

      // this.router.navigate(['/onesound/signin']);
      return false;
    }
  }
}

export const AuthGuardFn: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {

  return inject(AuthGuard).canActivate(next, state);
}
