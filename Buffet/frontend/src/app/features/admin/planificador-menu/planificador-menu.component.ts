import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-planificador-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './planificador-menu.component.html',
  styleUrl: './planificador-menu.component.css'
})
export class PlanificadorMenuComponent implements OnInit {
  private apiService = inject(ApiService);
  private cd = inject(ChangeDetectorRef);

  // Días fijos
  dias = [
    { id: 1, nombre: 'LUNES' },
    { id: 2, nombre: 'MARTES' },
    { id: 3, nombre: 'MIERCOLES' },
    { id: 4, nombre: 'JUEVES' },
    { id: 5, nombre: 'VIERNES' }
  ];

  platosDisponibles: any[] = []; // Para el select
  menuAsignado: any[] = [];      // Lo que ya está guardado en base de datos
  
  // Variables del formulario
  nuevoIdDia: number = 1;
  nuevoIdPlato: number = 0;

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    // 1. Traer Platos para el Select
    this.apiService.get('platos').subscribe((data: any) => {
      this.platosDisponibles = data;
    });

    // 2. Traer la Planificación Actual
    this.apiService.get('planificador').subscribe((data: any) => {
      this.menuAsignado = data;
      this.cd.detectChanges();
    });
  }

  // Filtra la lista completa para mostrar solo lo de UN día específico
  obtenerPlatosDelDia(idDia: number) {
    return this.menuAsignado.filter(item => item.id_dia === idDia);
  }

  asignarPlato() {
    if (this.nuevoIdPlato == 0) {
      alert("Seleccioná un plato por favor");
      return;
    }

    const payload = {
      id_dia: Number(this.nuevoIdDia),
      id_plato: Number(this.nuevoIdPlato)
    };

    this.apiService.post('planificador', payload).subscribe({
      next: () => {
        // Recargamos para ver el cambio
        this.cargarDatos();
        alert("✅ Plato asignado correctamente");
      },
      error: (err) => {
        alert("Error: " + (err.error?.message || "No se pudo asignar"));
      }
    });
  }

  eliminarDelDia(idAsignacion: number) {
    if (confirm("¿Quitar este plato del menú?")) {
      this.apiService.delete(`planificador/${idAsignacion}`).subscribe(() => {
        this.cargarDatos();
      });
    }
  }
}