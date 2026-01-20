import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { finalize } from 'rxjs/operators'; // 👈 Importante para apagar el loading siempre

@Component({
  selector: 'app-historial-pedidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-pedidos.component.html',
  styleUrl: './historial-pedidos.component.css'
})
export class HistorialPedidosComponent implements OnInit {
  private apiService = inject(ApiService);
  private cd = inject(ChangeDetectorRef); // 👈 Para forzar la actualización de la pantalla
  
  pedidos: any[] = [];
  loading = true;

  ngOnInit() {
    const usuarioString = localStorage.getItem('usuario');
    console.log("🔍 Usuario logueado:", usuarioString);

    if (usuarioString) {
      try {
        const usuario = JSON.parse(usuarioString);
        if (usuario.id) {
          this.cargarPedidos(usuario.id);
        } else {
          console.warn("El usuario no tiene ID válido.");
          this.loading = false;
        }
      } catch (e) {
        console.error("Error al leer usuario del localStorage", e);
        this.loading = false;
      }
    } else {
      console.warn("No hay usuario en sesión.");
      this.loading = false;
    }
  }

  cargarPedidos(idUsuario: number) {
    this.loading = true;

    this.apiService.get(`pedidos/usuario/${idUsuario}`)
      .pipe(
        // 👇 Esto se ejecuta SIEMPRE (haya éxito o error)
        finalize(() => {
          this.loading = false;
          this.cd.detectChanges(); // 👈 La "patada" para que Angular actualice la vista
        })
      )
      .subscribe({
        next: (data: any) => {
          console.log("✅ Pedidos recibidos:", data);
          this.pedidos = data;
        },
        error: (err) => {
          console.error("❌ Error al cargar pedidos:", err);
          // Opcional: Mostrar un alert si falla
          // alert('No se pudo cargar el historial.'); 
        }
      });
  }
}