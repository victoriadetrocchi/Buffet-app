import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './core/components/navbar/navbar.component'; // <--- Importar

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent], // <--- Agregar aquí
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private router = inject(Router);
  mostrarNavbar = false;

  constructor() {
    // Detectamos en qué ruta estamos para saber si mostrar el menú o no
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Si la ruta es '/login', ocultamos el navbar. Si no, lo mostramos.
        this.mostrarNavbar = !event.url.includes('/login');
      }
    });
  }
}