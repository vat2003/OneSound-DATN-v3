import {Inject, Injectable} from "@angular/core";
import {login} from "../adminEntity/DTO/login";
import {Observable, catchError} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {DOCUMENT} from "@angular/common";
import {HttpUtilService} from "./http.util.service";
import {account} from "../adminEntity/account/account";
import {Register} from "../adminEntity/DTO/Register";
import {UpdateUserDTO} from "../adminEntity/DTO/update.user.dto";

interface AccountResponse {
  content: account[];
  pageable: any; // Adjust the type as needed
  last: boolean;
  totalPages: number;
  totalElements: number;
  // Add other properties as needed
}

@Injectable({
  providedIn: 'root'
})
export class accountServiceService {
  private baseUrl = 'http://localhost:8080/api/v1';
  private apiLogin = `${this.baseUrl}/users/login`;
  private apiRegister = `${this.baseUrl}/users/register`;
  private apiUserDetail = `${this.baseUrl}/users/details`;
  private apiUserUpdate = `${this.baseUrl}/users/details`;
  localStorage?: Storage;

  private apiConfig = {
    headers: this.httpUtilService.createHeaders(),
  }

  constructor(
    private http: HttpClient,
    private httpUtilService: HttpUtilService, private httpClient: HttpClient,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.localStorage = document.defaultView?.localStorage;
  }

  login(login: login): Observable<any> {
    return this.http.post(this.apiLogin, login, this.apiConfig);
  }

  updateUser(id: number, account: account): Observable<Object> {
    return this.http.put<account>(`${this.baseUrl}/users/${id}`, account);
  }

  register(Register: Register): Observable<any> {
    debugger;
    return this.http.post(this.apiRegister, Register, this.apiConfig);
  }

  getUserById(id: number): Observable<account> {
    return this.http.get<account>(`${this.baseUrl}/users/${id}`);
  }

  getPages(page: number, size: number): Observable<AccountResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.httpClient.get<AccountResponse>(`${this.baseUrl}/Account`, {params});
  }

  deleteUser(id: number): Observable<Object> {
    return this.http.delete(`${this.baseUrl}/users/${id}`);
  }

  createAccount(account: account): Observable<account> {
    return this.http.post<account>(this.apiRegister, account, this.apiConfig);
  }

  UpdateProfile(updateUserDTO: UpdateUserDTO) {

    var userResponse = this.getUserResponseFromLocalStorage();

    return this.http.put(`${this.apiUserDetail}/${userResponse?.id}`, updateUserDTO, {})
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

  getUserResponseFromLocalStorage(): account | null {
    try {
      const userResponseJSON = this.localStorage?.getItem('user');
      if (userResponseJSON == null || userResponseJSON == undefined) {
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
      if (userResponse == null || !userResponse) {
        return;
      }
      const userResponseJSON = JSON.stringify(userResponse);
      this.localStorage?.setItem('user', userResponseJSON);
      console.log('User response saved to local storage.' + userResponseJSON);
    } catch (error) {
      console.error('Error saving user response to local storage:', error);
    }
  }


  removeUserFromLocalStorage(): void {
    try {
      this.localStorage?.removeItem('user');
      console.log('User data removed from local storage.');
    } catch (error) {
      console.error('Error removing user data from local storage:', error);
    }
  }


}
