import { Injectable } from '@angular/core';
import { Api } from './api';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor(
    private api: Api
  ){}

  login(email: string, password: string){
    return this.api.post(
      { 
        "email": email,
        "password": password 
      },
      'auth/');
  }

  isAuthenticated(){
    return this.api.get("auth/").pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }

}
