import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  error: string | null = null;
  loading = false;

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    phone: ['']
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
    this.api.register(this.form.value as any).subscribe({
      next: (res) => {
        this.auth.setToken(res.token);
        this.router.navigate(['/profile']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Register failed';
      }
    });
  }
}
