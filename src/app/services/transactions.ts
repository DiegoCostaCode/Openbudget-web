import { Injectable } from '@angular/core';
import { Api } from './api';
import { ProjectionSnapshotDTO, TransactionDTO } from '../models/transactions';
import { catchError, Observable, throwError } from 'rxjs';

export interface CreateTransactionDTO {
  amount: number;
  description: string;
  type: string;
  transactionDate: string;
  category?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Transactions {
  constructor(private api: Api) {}

  generateView(): Observable<ProjectionSnapshotDTO> {
    return this.api.get<ProjectionSnapshotDTO>('transaction/generateview/').pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  createTransaction(dto: CreateTransactionDTO): Observable<TransactionDTO> {
    return this.api.post<TransactionDTO>(dto, 'transaction/').pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
}
