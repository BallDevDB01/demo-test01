import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html'
})
export class EditProfileComponent implements OnInit {
  error: string | null = null;
  loading = false;

  form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    phone: ['']
  });

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.api.me().subscribe({
      next: (res) => {
        this.form.patchValue({
          firstName: res.user.firstName,
          lastName: res.user.lastName,
          phone: res.user.phone || ''
        });
      },
      error: (err) => (this.error = err?.error?.message || 'Failed to load profile')
    });
  }

  submit(): void {
    this.error = null;
    if (this.form.invalid) return;

    this.loading = true;
    this.api.updateMe(this.form.value as any).subscribe({
      next: () => this.router.navigate(['/profile']),
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Update failed';
      }
    });
  }
}
