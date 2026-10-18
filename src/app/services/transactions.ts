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

  generateView(days: number = 30): Observable<ProjectionSnapshotDTO> {
    return this.api.get<ProjectionSnapshotDTO>(`transaction/generateview/?days=${days}`).pipe(
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

  updateTransaction(id: string, dto: CreateTransactionDTO): Observable<TransactionDTO> {
    return this.api.put<TransactionDTO>(dto, `transaction/${id}`).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  deleteTransaction(id: string): Observable<string> {
    return this.api.delete<string>(`transaction/${id}`, { responseType: 'text' as 'json' }).pipe(
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
}
