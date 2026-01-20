import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈 Importar
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-gestion-platos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-platos.component.html',
  styleUrl: './gestion-platos.component.css'
})
export class GestionPlatosComponent implements OnInit {
  private apiService = inject(ApiService);
  private cd = inject(ChangeDetectorRef); // 👈 Inyectar
  
  platos: any[] = [];
  nuevoPlato = { nombre: '', descripcion: '', categoria: 'Principal', precio: 0, stock: 100 };

  ngOnInit() {
    this.cargarPlatos();
  }

  cargarPlatos() {
    this.apiService.get('platos')
      .pipe(finalize(() => this.cd.detectChanges())) // 👈 LA PATADA
      .subscribe({
        next: (data: any) => this.platos = data,
        error: (err) => console.error(err)
      });
  }

  guardarPlato() {
    this.apiService.post('platos', this.nuevoPlato).subscribe(() => {
      alert('¡Plato agregado!');
      this.cargarPlatos(); // Recarga la lista
      this.nuevoPlato = { nombre: '', descripcion: '', categoria: 'Principal', precio: 0, stock: 100 };
    });
  }

  eliminarPlato(id: number) {
    if(confirm('¿Borrar plato?')) {
      this.apiService.delete(`platos/${id}`).subscribe(() => this.cargarPlatos());
    }
  }
}