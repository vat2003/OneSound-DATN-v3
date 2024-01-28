import { Inject, Injectable } from "@angular/core";
import { login } from "../adminEntity/LoginDTO/login";
import { Observable, catchError } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DOCUMENT } from "@angular/common";
import { HttpUtilService } from "./http.util.service";
import { account } from "../adminEntity/account/account";
import { Register } from "../adminEntity/LoginDTO/register.dto";

@Injectable({
    providedIn: 'root'
  })
export class accountServiceService{
    private baseUrl = 'http://localhost:8080/api/v1';
    private apiLogin = `${this.baseUrl}/users/login`;
    private apiRegister = `${this.baseUrl}/users/register`;
    private apiUserDetail = `${this.baseUrl}/users/details`;
    localStorage?:Storage;

    private apiConfig = {
      headers: this.httpUtilService.createHeaders(),
    }

    constructor(
        private http: HttpClient,
        private httpUtilService: HttpUtilService,
        @Inject(DOCUMENT) private document: Document
        ) { 
          this.localStorage = document.defaultView?.localStorage;
        }  

    login(login: login): Observable<any> {    
      return this.http.post(this.apiLogin, login, this.apiConfig);
    }

    
    register(Register: Register):Observable<any> {
      return this.http.post(this.baseUrl, Register, this.apiConfig);
    
     
    }

    getUserDetail(token: string) {
      const trimmedToken = token.trim();
    
      return this.http.post(this.apiUserDetail, {}, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${trimmedToken}`
        })
      });
    }
    

  
        

}