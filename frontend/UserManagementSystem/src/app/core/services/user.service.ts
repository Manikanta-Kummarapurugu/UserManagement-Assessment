import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api = 'http://127.0.0.1:8000';

  // private http = inject(HttpClient);
  constructor(private http: HttpClient) {} 
  // Method to fetch all users
  getUsers(search = '',skip = 0, limit = 10,sort = 'id'): Observable<any>{
    const params = new HttpParams()
      .set('search', search)
      .set('skip', skip.toString())
      .set('limit', limit.toString())
      .set('sort', sort);
    return this.http.get<any>(`${this.api}/users`, { params });
  }
  //Method to Add new user
  createUser(data: any) {
    return this.http.post<any>(`${this.api}/users`, data);
  }
  // Method to update a user by ID
  updateUser(id: number, data: any) {
    return this.http.put<any>(`${this.api}/users/${id}`, data);
  }
  // Method to delete a user by ID
  deleteUser(id: number) {
    return this.http.delete<any>(`${this.api}/users/${id}`);
  }
  
}
