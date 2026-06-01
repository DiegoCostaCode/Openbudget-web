import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
// import { Auth } from '../services/auth';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  // const auth = inject(Auth)
  const router = inject(Router)

  req = req.clone({
    withCredentials: true
  })

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if(error.status === 401) {
        router.navigate(["/login"]);
        return throwError(() => error)
      }
      return throwError(() => error)
    })
  );
};
