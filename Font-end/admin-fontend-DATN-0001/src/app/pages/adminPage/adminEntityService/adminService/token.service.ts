import { Inject, Injectable } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'access_token';
  private jwtHelperService = new JwtHelperService();
  localStorage?:Storage;


  constructor(@Inject(DOCUMENT) private document: Document){
    this.localStorage = document.defaultView?.localStorage;
}

  getToken():string {
    return this.localStorage?.getItem(this.TOKEN_KEY) ?? '';
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }
  removeToken(): void {
    this.localStorage?.removeItem(this.TOKEN_KEY);
}   

isTokenExpired(): boolean { 
  
  if(this.getToken() == null) {
    
      return false;
  }       
  return this.jwtHelperService.isTokenExpired(this.getToken()!);
}

getUserId(): number {
  
  let token = this.getToken();
  if (!token) {
    
      return 0;
  }
  
  let userObject = this.jwtHelperService.decodeToken(token);
  console.log(userObject);
  
  return 'userId' in userObject ? parseInt(userObject['userId']) : 0;
}
}
