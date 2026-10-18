import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { RecurrenceDTO, RecurrenceRequestDTO } from '../models/recurrences';

@Injectable({
  providedIn: 'root',
})
export class Recurrences {
  constructor(private api: Api) {}

  findAll(): Observable<RecurrenceDTO[]> {
    return this.api.get<RecurrenceDTO[]>('recurrence/');
  }

  create(dto: RecurrenceRequestDTO): Observable<RecurrenceDTO> {
    return this.api.post<RecurrenceDTO>(dto, 'recurrence/');
  }

  update(id: string, dto: RecurrenceRequestDTO): Observable<RecurrenceDTO> {
    return this.api.put<RecurrenceDTO>(dto, `recurrence/${id}`);
  }

  delete(id: string): Observable<string> {
    return this.api.delete<string>(`recurrence/${id}`, { responseType: 'text' as 'json' });
  }
}
