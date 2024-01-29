import { Inject, Injectable } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly TOKEN_KEY = 'access_token';
  localStorage?:Storage;

  constructor(){
  }

  getToken():string {
    return this.localStorage?.getItem(this.TOKEN_KEY) ?? '';
  }
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }



}
