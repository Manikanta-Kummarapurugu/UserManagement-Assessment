import { Component, inject, signal } from '@angular/core';
import { MessageService } from 'primeng/api';

import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
checked1 = signal<boolean>(true);
  email = ''
  password = ''
  error = ''

  private messageService = inject(MessageService);
  private authService = inject(AuthService);
  private router = inject(Router);


  // Method to handle login form submission
  onLogin() {
    if (!this.email || !this.password) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all fields.' });

      return;
    }
    const loginData = {
      email: this.email,
      password: this.password
    };

    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.router.navigate(['/users']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.error = error.error?.message || 'Login failed. Please try again.';
      }
    });
  }

}