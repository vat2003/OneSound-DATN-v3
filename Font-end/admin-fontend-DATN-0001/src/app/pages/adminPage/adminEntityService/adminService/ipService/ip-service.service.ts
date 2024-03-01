import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IpServiceService {

  constructor(private http: HttpClient) { }

  getIpAddress() {
    return this.http.get('https://api.ipify.org/?format=json');
  }
}
