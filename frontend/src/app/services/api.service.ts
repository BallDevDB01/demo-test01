import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserDto {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient, private auth: AuthService) {}

  private authHeaders(): HttpHeaders {
    const token = this.auth.token;
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }

  register(payload: RegisterRequest): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/auth/register`, payload);
  }

  login(payload: LoginRequest): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.baseUrl}/auth/login`, payload);
  }

  me(): Observable<{ user: UserDto }> {
    return this.http.get<{ user: UserDto }>(`${this.baseUrl}/profile/me`, {
      headers: this.authHeaders()
    });
  }

  updateMe(payload: Partial<Pick<UserDto, 'firstName' | 'lastName' | 'phone'>>): Observable<{ user: UserDto }> {
    return this.http.put<{ user: UserDto }>(`${this.baseUrl}/profile/me`, payload, {
      headers: this.authHeaders()
    });
  }
}
