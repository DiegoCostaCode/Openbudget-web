import { Injectable } from '@angular/core';
import { Api } from './api';
import { ProjectionSnapshotDTO } from '../models/transactions';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Transactions {

  constructor (
    private api: Api
  ){}

  generateView(): Observable<ProjectionSnapshotDTO>{
    return this.api.get<ProjectionSnapshotDTO>("transaction/generateview/").pipe(
      catchError(err => {
        return throwError(() => err);
      })
    );
  }

}
