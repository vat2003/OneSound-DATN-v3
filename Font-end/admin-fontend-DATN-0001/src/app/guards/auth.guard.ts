import { Injectable } from '@angular/core';
import { 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  CanActivateFn, 
} from '@angular/router';
import { Router } from '@angular/router'; // Đảm bảo bạn đã import Router ở đây.
import { inject } from '@angular/core';
import { TokenService } from '../pages/adminPage/adminEntityService/adminService/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {  
  constructor(
    private tokenService: TokenService, 
    private router: Router,    
  ) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    debugger
    const isTokenExpired = this.tokenService.isTokenExpired();
    const isUserIdValid = this.tokenService.getUserId() > 0;
    
    if (!isTokenExpired && isUserIdValid) {
      debugger
      return true;
    } else {
      debugger
      this.router.navigate(['/onesound/signin']);
      return false;
    }
  }
}

export const AuthGuardFn: CanActivateFn = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean => {
  debugger
  return inject(AuthGuard).canActivate(next, state);
}

