import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from './api';
import { CategoryDTO } from '../models/categories';

@Injectable({
  providedIn: 'root',
})
export class Categories {
  constructor(private api: Api) {}

  findAll(): Observable<CategoryDTO[]> {
    return this.api.get<CategoryDTO[]>('category/');
  }

  create(name: string): Observable<CategoryDTO> {
    return this.api.post<CategoryDTO>({ name }, 'category/');
  }
}
