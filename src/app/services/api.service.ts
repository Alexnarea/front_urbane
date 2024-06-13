// src/app/services/api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Employee } from '../interfaces/employees';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private url = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.url}/employees`);
  }

  create(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(`${this.url}/employees`, employee);
  }

  update(id: string, employee: Employee): Observable<Employee> {
    return this.http.patch<Employee>(`${this.url}/employees/${id}`, employee);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/employees/${id}`);
  }
}
