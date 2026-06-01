import { inject } from '@angular/core';
import { CanActivateFn, Router} from '@angular/router';
import {Auth} from '../services/auth';
import { map } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route, state) => {

  const auth = inject(Auth)
  const router = inject(Router)

  return auth.isAuthenticated().pipe(
    map(isAuth => {
      if (isAuth) {
        return true;
      }
      router.navigate(['login']);
      return false;
    })
  );
};
