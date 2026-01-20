import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // <--- Importante para [(ngModel)]
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

  // Modelo del formulario
  credenciales = {
    email: '',
    password: ''
  };

  loading = false;
  errorMsg = '';

  onLogin() {
    this.loading = true;
    this.errorMsg = '';

    // Llamamos al nuevo endpoint '/auth/login'
    this.apiService.post('auth/login', this.credenciales).subscribe({
      next: (usuario) => {
        console.log('Login exitoso:', usuario);
        // Guardamos al usuario en el localStorage (memoria del navegador)
        localStorage.setItem('usuario', JSON.stringify(usuario));
        
        // Redirigimos al home (o al menú)
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