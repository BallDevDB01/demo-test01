import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService, UserDto } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  user: UserDto | null = null;
  error: string | null = null;

  constructor(private api: ApiService, private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.api.me().subscribe({
      next: (res) => (this.user = res.user),
      error: (err) => (this.error = err?.error?.message || 'Failed to load profile')
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
