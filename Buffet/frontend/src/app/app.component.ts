import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './core/components/navbar/navbar.component'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent], 
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private router = inject(Router);
  mostrarNavbar = false;

  constructor() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.mostrarNavbar = !event.url.includes('/login');
      }
    });
  }
}