import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataGlobalService {
  private idSource = new BehaviorSubject<any>(null);
  YtGlobalId = this.idSource.asObservable();

  private arrPreNextSource = new BehaviorSubject<any[]>([]);
  arrPreNext = this.arrPreNextSource.asObservable();

  constructor() {}

  changeArr(arr: any[]) {
    this.arrPreNextSource.next(arr);
  }

  changeId(video: any) {
    this.idSource.next(video);
  }

  //lưu lịch sử vừa xem
  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key: string): any {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  clear(): void {
    localStorage.clear();
  }
}
