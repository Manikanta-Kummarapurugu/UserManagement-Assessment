import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { tap } from "rxjs/internal/operators/tap";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = 'http://127.0.0.1:8000';
  private http = inject(HttpClient);

  // Login method to authenticate user and store token
  login(data:any){
    return this.http.post<any>(`${this.api}/login/`, data).pipe(
      tap(response => {
        if (response && response.access_token) {
          localStorage.setItem('token', response.access_token);
        }
      })
    );
  }

  //Register method to create new user
  register(data:any){
    return this.http.post<any>(`${this.api}/register/`, data);
  }

  //Logout method to remove token from localStorage
  logout(){
    localStorage.removeItem('token');
  }
  getToken(){
    return localStorage.getItem('token');
  }
}