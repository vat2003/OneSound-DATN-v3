import {Inject, Injectable} from "@angular/core";
import {login} from "../adminEntity/DTO/login";
import {Observable, catchError} from "rxjs";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {DOCUMENT} from "@angular/common";
import {HttpUtilService} from "./http.util.service";
import {account} from "../adminEntity/account/account";
import {Register} from "../adminEntity/DTO/Register";
import {UpdateUserDTO} from "../adminEntity/DTO/update.user.dto";
import {UpdateUserForAdmin} from "../adminEntity/DTO/UpdateUserForAdmin";
import {Feedback} from "../adminEntity/DTO/Feedback";

interface AccountResponse {
  content: account[];
  pageable: any;
  last: boolean;
  totalPages: number;
  totalElements: number;
}

@Injectable({
  providedIn: 'root'
})
export class accountServiceService {

  private baseUrl = 'http://localhost:8080/api/v1';
  private apiLogin = `${this.baseUrl}/users/login`;
  private apiRegister = `${this.baseUrl}/users/register`;
  private apiUserDetail = `${this.baseUrl}/users/details`;
  private apiUsercreate = `${this.baseUrl}/users/create`;
  private apiUserdelete = `${this.baseUrl}/users`;
  localStorage?: Storage;
  private apicheckmail = `${this.baseUrl}/users/email`;
  private apicheckmailuser = `${this.baseUrl}/users/emailUser`;
  private apiupdateuser = `${this.baseUrl}/users/update`;
  private apiupdateuseradmin = `${this.baseUrl}/users/update/admin`;

  private thongbao = `${this.baseUrl}/users/mess`;
  private checktoken = `${this.baseUrl}/users/resetPassword/token`;
  private guimail = `${this.baseUrl}/users/forgotPassword`;
  private Feedback = `${this.baseUrl}/users/feed`;
  private DoiMatKhauCuaQuenMatKhau = `${this.baseUrl}/users/update/pass`;

  private apicheckactive = `${this.baseUrl}/users/checkactive`;

  private apiLoginGoogle = `${this.baseUrl}/emails/users/`;
  private apiLoginFacebook = `${this.baseUrl}/facebooks/users/`;
  private apiLoginGit = `${this.baseUrl}/githubs/users/`;
  private apiUpdateActive = `${this.baseUrl}/users/UpdateActive`;


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


  getGoogleUserInfo(id: number): Observable<any> {
    return this.http.get<any>(this.apiLoginGoogle + id.toString());
  }

  getFacebookUserInfo(id: number): Observable<any> {
    return this.http.get<any>(this.apiLoginFacebook + id.toString());
  }

  getGithubUserInfo(id: number): Observable<any> {
    return this.http.get<any>(this.apiLoginGit + id.toString());
  }


  EmailFeedBack(Feedback: Feedback): Observable<Object> {
    debugger
    return this.http.post<account>(`${this.Feedback}`, Feedback, {});
  }


  checkactive1(email: string): Observable<any> {
    const requestData = {email: email};
    return this.http.post<any>(this.apicheckactive, requestData);
  }

  // guimail
  HamDoiMatKhauCuaQuenMatKhau(email: string, login: login): Observable<Object> {
    debugger
    return this.http.put<account>(`${this.DoiMatKhauCuaQuenMatKhau}/${email}`, login, {});
  }


  getAllUsers(): Observable<account[]> {
    return this.http.get<account[]>(`${this.baseUrl}/users/user`);
  }

  getemailuser(email: string): Observable<account> {
    return this.http.get<account>(`${this.baseUrl}/users/emailUser/${email}`);
  }

  getAllAlbumByAuthorByName(title: string, page: number, size: number): Observable<account> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.httpClient.get<account>(`${this.baseUrl}/getaccountByName/${title}`, {params});
  }

  getchecktokem(token: string): Observable<any> {
    return this.http.get<any>(`${this.checktoken}/${token}`);
  }

  guimail1(email: string): Observable<any> {
    debugger
    return this.http.get<any>(`${this.guimail}/${email}`);
  }

  hot(message: string, email: string): Observable<any> {
    debugger
    return this.http.post(`${this.thongbao}/${message}/${email}`, {});
  }

  login(login: login): Observable<any> {
    return this.http.post(this.apiLogin, login, this.apiConfig);
  }

  register(Register: Register): Observable<any> {
    return this.http.post(this.apiRegister, Register, this.apiConfig);
  }

  createAccount(account: account): Observable<account> {
    return this.http.post<account>(this.apiUsercreate, account, this.apiConfig);
  }


  updateUser(id: number, account: UpdateUserForAdmin): Observable<Object> {
    return this.http.put<account>(`${this.apiupdateuseradmin}/${id}`, account);
  }

  UpdateActive(id: number, account: UpdateUserForAdmin): Observable<Object> {
    return this.http.put<account>(`${this.apiUpdateActive}/${id}`, account);
  }


  getUserById(id: number): Observable<account> {
    return this.http.get<account>(`${this.baseUrl}/users/${id}`);
  }

  getPages(page: number, size: number): Observable<AccountResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.httpClient.get<AccountResponse>(`${this.baseUrl}/users/page`, {params});
  }

  deleteUser(id: number): Observable<Object> {
    return this.http.delete(`${this.apiUserdelete}/${id}`);
  }

  UpdateProfile(updateUserDTO: UpdateUserDTO) {
    var userResponse = this.getUserResponseFromLocalStorage();
    return this.http.put(`${this.apiupdateuser}/${userResponse?.id}`, updateUserDTO, {})

  }

  checkEmailExists(email: string): Observable<boolean> {
    const url = `${this.apicheckmail}/${email}`;
    return this.http.get<boolean>(url);
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
