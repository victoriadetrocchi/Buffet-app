import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private apiService = inject(ApiService);
  private router = inject(Router);

  credenciales = {
    email: '',
    password: ''
  };

  loading = false;
  errorMsg = '';

  onLogin() {
    this.loading = true;
    this.errorMsg = '';

    this.apiService.post('auth/login', this.credenciales).subscribe({
      next: (usuario) => {
        console.log('Login exitoso:', usuario);
        localStorage.setItem('usuario', JSON.stringify(usuario));
        
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error:', err);
        this.errorMsg = 'Credenciales incorrectas. Intenta de nuevo.';
        this.loading = false;
      }
    });
  }
}