import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CountUserByDate } from '../../adminEntity/DTO/count-user-by-date';
import { account } from '../../adminEntity/account/account';
import { CookieService } from 'ngx-cookie-service';
import { Visit } from '../../adminEntity/DTO/visit';

@Injectable({
  providedIn: 'root'
})
export class StaticticalService {

  private visitCookieName = 'visitCount';

  private baseURL = 'http://localhost:8080/api/v1'
  constructor(private httpClient: HttpClient, private cookieService: CookieService) { }

  getQuantityUser(sort: number): Observable<CountUserByDate[]> {
    return this.httpClient.get<CountUserByDate[]>(`${this.baseURL}/statictical/get-user-by-date/${sort}`);
  }

  getQuantityUserById(sort: number): Observable<CountUserByDate[]> {
    return this.httpClient.get<CountUserByDate[]>(`${this.baseURL}/statictical/get-user-by-id/${sort}`);
  }

  getAllUserByDate(date: Date): Observable<account[]> {
    return this.httpClient.get<account[]>(`${this.baseURL}/statictical/get-user-by-create-date/${date}`);
  }

  getAllUserByDateLong(date: number): Observable<account[]> {
    return this.httpClient.get<account[]>(`${this.baseURL}/statictical/get-user-by-create-date/${date}`);
  }

  // recordVisit(): Observable<Visit> {
  //   return this.httpClient.post<Visit>(`${this.baseURL}/visit/record`);
  // }
  recordVisit(): Observable<Visit[]> {
    return this.httpClient.post<Visit[]>(`${this.baseURL}/visit/record`, {});
  }

  getVisitWDate(): Observable<Visit[]> {
    return this.httpClient.get<Visit[]>(`${this.baseURL}/visit/count/date`);
  }

  getCountUserBetweenDate(date1: number, date2: number): Observable<CountUserByDate[]> {
    return this.httpClient.get<CountUserByDate[]>(`${this.baseURL}/statictical/get-count-user-by-create-date/${date1}/${date2}`)
  }

  getCountUserByDayOfCreateDate(day: number): Observable<account[]> {
    return this.httpClient.get<account[]>(`${this.baseURL}/statictical/get-user-by-day-of-create-date/${day}`)
  }

  getCountUserByMonthOfCreateDate(month: number): Observable<account[]> {
    return this.httpClient.get<account[]>(`${this.baseURL}/statictical/get-user-by-month-of-create-date/${month}`)
  }

  getCountUserByYearOfCreateDate(year: number): Observable<account[]> {
    return this.httpClient.get<account[]>(`${this.baseURL}/statictical/get-user-by-year-of-create-date/${year}`)
  }

  getUserByOption(day: any, month: any, year: any): Observable<account[]> {
    return this.httpClient.get<account[]>(`${this.baseURL}/statictical/get-user-by-option-date/${day}/${month}/${year}`)
  }

  getCountUserByYearOrderByMonth(year: number) {
    return this.httpClient.get<any[]>(`${this.baseURL}/statictical/get-count-user-by-year/${year}`)

  }

  getAllListens() {
    return this.httpClient.get<any[]>(`${this.baseURL}/statictical/listens`)
  }

  getListensBetweenLisDate(date1: number, date2: number): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this.baseURL}/statictical/listens/between/${date1}/${date2}`)
  }

  getTop10Listens() {
    return this.httpClient.get<any[]>(`${this.baseURL}/statictical/listens/get-top10`)
  }

  getCountSong() {
    return this.httpClient.get<any[]>(`${this.baseURL}/statictical/get-song`)
  }

  getCountAlbum() {
    return this.httpClient.get<any[]>(`${this.baseURL}/statictical/get-album`)
  }
  getCountGenres() {
    return this.httpClient.get<any[]>(`${this.baseURL}/statictical/get-genres`)
  }


}
