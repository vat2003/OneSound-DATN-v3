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
      
      return this.http.post(this.apiRegister, Register, this.apiConfig);         
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

    getUserResponseFromLocalStorage():account | null {    
      try {        
        const userResponseJSON = this.localStorage?.getItem('user'); 
        if(userResponseJSON == null || userResponseJSON == undefined) {
          return null;
        }
        const userResponse = JSON.parse(userResponseJSON!);  
        console.log('User response retrieved from local storage.');
        return userResponse;
      } catch (error) {
        console.error('Error retrieving user response from local storage:', error);
        return null; 
      }
    }

    saveUserResponseToLocalStorage(userResponse?: account) {
        
      try {        
        if(userResponse == null || !userResponse) {
          return;
        }
        const userResponseJSON = JSON.stringify(userResponse);  
        this.localStorage?.setItem('user', userResponseJSON);  
        console.log('User response saved to local storage.' + userResponseJSON);
      } catch (error) {
        console.error('Error saving user response to local storage:', error);
      }
    }


    removeUserFromLocalStorage():void {
      try {
        this.localStorage?.removeItem('user');
        console.log('User data removed from local storage.');
      } catch (error) {
        console.error('Error removing user data from local storage:', error);
      }
    }
    

  
        

}