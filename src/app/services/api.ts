import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Api {

  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ){}

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(this.baseUrl + endpoint);
  }

  post<T>(data: any, endpoint: string, options?: object): Observable<T> {
    return this.http.post<T>(this.baseUrl + endpoint, data, options);
  }

  put<T>(data: any, endpoint: string, options?: object): Observable<T> {
    return this.http.put<T>(this.baseUrl + endpoint, data, options);
  }

  delete<T>(endpoint: string, options?: object): Observable<T> {
    return this.http.delete<T>(this.baseUrl + endpoint, options);
  }

}
