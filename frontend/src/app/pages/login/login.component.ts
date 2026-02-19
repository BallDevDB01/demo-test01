import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  error: string | null = null;
  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  submit(): void {
    this.error = null;
    if (this.form.invalid) return;

    this.loading = true;
    this.api.login(this.form.value as any).subscribe({
      next: (res) => {
        this.auth.setToken(res.token);
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Login failed';
      }
    });
  }
}
