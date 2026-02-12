import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], 
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  private router = inject(Router);

  usuario: any = null;

  ngOnInit() {
    this.verificarUsuario();
  }

  verificarUsuario() {
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (usuarioGuardado) {
      try {
        this.usuario = JSON.parse(usuarioGuardado);
      } catch (error) {
        console.error("Error al leer usuario del almacenamiento", error);
        this.usuario = null;
      }
    }
  }

  logout() {
    localStorage.removeItem('usuario');
    
    this.usuario = null;

    this.router.navigate(['/login']);
  }

  esPaginaLogin(): boolean {
    return this.router.url === '/login';
  }
}