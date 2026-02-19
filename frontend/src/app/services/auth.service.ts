import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'token';

  get token(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.token;
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
