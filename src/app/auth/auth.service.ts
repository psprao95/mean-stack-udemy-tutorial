import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


const BACKEND_URL = environment.apiUrl + "/users";
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token: any;
  isAuthenticated = false;
  private tokenTimer: any;
  private userId: any;
  private authStatusListener = new Subject<boolean>();
  constructor(private httpClient: HttpClient, private router: Router) {}

  isAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password,
    };
    this.httpClient
      .post(BACKEND_URL+"/signup", authData)
      .subscribe(
        () => {
          this.router.navigate(['/']);
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  loginUser(email: string, password: string) {
    const authData = {
      email: email,
      password: password,
    };
    this.httpClient
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL+"/login",
        authData
      )
      .subscribe(
        (result) => {
          console.log(result);
          const token = result.token;
          this.token = token;
          if (token) {
            const expiresIn = result.expiresIn;
            console.log(expiresIn);
            this.userId = result.userId;
            this.setAuthTimer(expiresIn);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresIn * 1000);
            console.log(expirationDate);
            this.saveAuthData(token, expirationDate, this.userId);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.router.navigate(['/']);
          this.authStatusListener.next(false);
        }
      );
  }

  logoutUser() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
  }

  getToken() {
    return this.token;
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    const now = new Date();
    if (authInfo) {
      const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
      console.log(authInfo, expiresIn);
      if (expiresIn) {
        this.token = authInfo.token;
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.setAuthTimer(expiresIn / 1000);
        this.userId = authInfo.userId;
      }
    }
  }

  private setAuthTimer(duration: number) {
    console.log('setting timer ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logoutUser();
    }, duration * 1000);
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
    };
  }
}
