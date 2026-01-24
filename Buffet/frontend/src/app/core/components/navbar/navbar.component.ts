import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], // Necesario para que funcionen los routerLink
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  private router = inject(Router);
  
  // Esta es la variable que usa el HTML para saber si mostrar menú de Admin o Empleado
  usuario: any = null;

  ngOnInit() {
    this.verificarUsuario();
  }

  // Función para leer quién está logueado
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
    // 1. Borramos la sesión del navegador
    localStorage.removeItem('usuario');
    
    // 2. Borramos la variable para que el menú se oculte INSTANTÁNEAMENTE
    this.usuario = null;

    // 3. Redirigimos al Login
    this.router.navigate(['/login']);
  }

  esPaginaLogin(): boolean {
    return this.router.url === '/login';
  }
}