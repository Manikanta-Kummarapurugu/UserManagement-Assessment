import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  user = {
    name: '',
    email: '',
    password: ''
  };
  error = '';
  success = '';
  
  private messageService = inject(MessageService);
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);
  // Method to handle registration form submission
  register() {
    if (!this.user.name || !this.user.email || !this.user.password) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all fields.' });
      return;
    }
    this.authService.register(this.user).subscribe({
      next: (response) => { 
        console.log('Registration successful:', response);
        this.success = 'Registration successful!';
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User registered successfully.' });
        setTimeout(() => this.router.navigate(['/login']), 2000); // Redirect to login after 2 seconds
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.error = 'Registration failed. Please try again.';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to register user.' });
      }
    });
  }
}