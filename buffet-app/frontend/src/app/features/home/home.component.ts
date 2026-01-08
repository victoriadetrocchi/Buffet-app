import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private apiService = inject(ApiService);
  
  mensaje: any;
  cargando: boolean = true;
  error: boolean = false;

  ngOnInit() {
    this.cargarDatosPrueba();
  }

  cargarDatosPrueba() {
    this.cargando = true;
    this.error = false;

    // Llamamos al endpoint raíz de la API ('')
    this.apiService.get('').subscribe({
      // 👇 Agregamos ': any' aquí
      next: (data: any) => {
        console.log('✅ Datos recibidos del backend:', data);
        this.mensaje = data;
        this.cargando = false;
      },
      // 👇 Agregamos ': any' aquí también
      error: (err: any) => {
        console.error('❌ Error de conexión:', err);
        this.error = true;
        this.cargando = false;
      }
    });
  }
}