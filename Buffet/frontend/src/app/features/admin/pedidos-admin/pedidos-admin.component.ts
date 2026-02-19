import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈 Importar
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-pedidos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos-admin.component.html',
  styleUrl: './pedidos-admin.component.css'
})
export class PedidosAdminComponent implements OnInit {
  private apiService = inject(ApiService);
  private cd = inject(ChangeDetectorRef); 
  
  pedidos: any[] = [];
  estados = [{ id: 1, nombre: 'PENDIENTE' }, { id: 2, nombre: 'EN PREPARACIÓN' }, { id: 3, nombre: 'ENTREGADO' }];

  ngOnInit() {
    this.cargarTodos();
  }

  cargarTodos() {
    this.apiService.get('pedidos')
      .pipe(finalize(() => this.cd.detectChanges()))
      .subscribe({
        next: (data: any) => this.pedidos = data,
        error: (err) => console.error(err)
      });
  }

cambiarEstado(pedido: any, nuevoEstadoId: string) {
  const idEstado = parseInt(nuevoEstadoId);
  
  this.apiService.put(`pedidos/${pedido.id}/estado`, { id_estado: idEstado }).subscribe({
    next: () => {
      pedido.id_estado = idEstado;

      const estadoEncontrado = this.estados.find(e => e.id === idEstado);
      if (estadoEncontrado) {
        pedido.nombre_estado = estadoEncontrado.nombre;
      }

      console.log(`✅ Pedido #${pedido.id} actualizado a ${pedido.nombre_estado}`);
      this.cd.detectChanges(); 
    },
    error: (err) => {
      alert('Error al cambiar estado');
      console.error(err);
    }
  });
}
}
