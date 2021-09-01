import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';
import { Register } from '../models/register.model';
import { Login } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private http: HttpClient, public router: Router) { }

  userSignin(login: Login) {
    return this.http.post<{token: string, user: User}>(environment.apiUrl + 'auth/login', login);
  }

  userSignup(register: Register) {
    return this.http.post(environment.apiUrl + 'auth/signup', register);
  }
}
