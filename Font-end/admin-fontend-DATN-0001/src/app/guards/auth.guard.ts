import {Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanActivateFn,
} from '@angular/router';
import {Router} from '@angular/router'; // Đảm bảo bạn đã import Router ở đây.
import {inject} from '@angular/core';
import {TokenService} from '../pages/adminPage/adminEntityService/adminService/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {
  constructor(
    private tokenService: TokenService,
    private router: Router,
  ) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    
    const isTokenExpired = this.tokenService.isTokenExpired();
    const isUserIdValid = this.tokenService.getUserId() > 0;

    if (!isTokenExpired && isUserIdValid) {
      
      return true;
    } else {
      
      this.router.navigate(['/onesound/signin']);
      return false;
    }
  }
}

export const AuthGuardFn: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  
  return inject(AuthGuard).canActivate(next, state);
}
