import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  map, tap } from 'rxjs/operators';
import {BehaviorSubject} from 'rxjs';
import { Router } from '@angular/router';

export interface AuthData {
  accessToken: string,
  user : {
      id: number,
      email: string,
  }
}
export interface SignupData {
  name: string,
  email: string,
  password: string
}



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authSubject  = new BehaviorSubject<null | AuthData>(null);
  user$ = this.authSubject.asObservable()
  isLoggedIn$ = this.user$.pipe(map(u=>!!u))


  user! : {id: number, email: string };



  path: string = 'http://localhost:4201/api'
  constructor(private http: HttpClient, private router: Router) { }

  signUp(user: {email: string, password:string, name: string}){
    return this.http.post<AuthData>(`${this.path}/users`, user);
  }


  signIn(user: {email: string, password: string}){
    return this.http.post<AuthData>(`${this.path}/login`, user).pipe(tap(data => {
      this.authSubject.next(data);
      localStorage.setItem('user', JSON.stringify(data))
      this.user = data.user;
    }));
  }

  logout() {
    this.authSubject.next(null);
    localStorage.removeItem('user')
    this.router.navigate(['/login'])

  }
}
