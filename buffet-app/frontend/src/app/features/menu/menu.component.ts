import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private cd = inject(ChangeDetectorRef);

  menu: any[] = [];
  carrito: any[] = [];
  loading = true;
  total = 0;

  ngOnInit() {
    this.cargarMenu();
  }

cargarMenu() {
    this.loading = true;
    this.apiService.get('menu').subscribe({
      next: (data: any) => {
        this.menu = data;
        this.loading = false;
        
        this.cd.detectChanges(); 
      },
      error: (err: any) => {
        console.error('Error al cargar menú', err);
        this.loading = false;
        alert('Error de conexión.');
        
        this.cd.detectChanges(); // <--- Ponelo acá también por las dudas
      }
    });
  }

  agregarAlCarrito(plato: any) {
    const itemExistente = this.carrito.find(item => item.id === plato.id);

    if (itemExistente) {
      if (itemExistente.cantidad < plato.stock) {
        itemExistente.cantidad++;
      } else {
        alert("¡No hay más stock disponible!");
      }
    } else {
      this.carrito.push({ ...plato, cantidad: 1 });
    }
    this.calcularTotal();
    this.cd.detectChanges();
  }

  // 👇 ESTA ES LA FUNCIÓN QUE TE FALTABA
  eliminarDelCarrito(index: number) {
    this.carrito.splice(index, 1);
    this.calcularTotal();
    this.cd.detectChanges();
  }

  calcularTotal() {
    this.total = this.carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  }

  confirmarPedido() {
    if (this.carrito.length === 0) return;

    const usuarioString = localStorage.getItem('usuario');
    if (!usuarioString) {
      alert("Debes iniciar sesión para pedir.");
      this.router.navigate(['/login']);
      return;
    }
    const usuario = JSON.parse(usuarioString);

    const pedido = {
      id_usuario: usuario.id,
      semana: this.obtenerSemanaActual(),
      detalles: this.carrito.map(item => ({
        id_item_menu: item.id,
        cantidad: item.cantidad
      }))
    };

    this.apiService.post('pedidos', pedido).subscribe({
      next: (resp) => {
        alert("¡Pedido realizado con éxito! 🍔");
        this.carrito = [];
        this.total = 0;
        this.cargarMenu(); // Recargamos para actualizar stock
      },
      error: (err) => {
        console.error(err);
        alert("Error al pedir: " + (err.error?.error || "Intente nuevamente"));
      }
    });
  }

  obtenerSemanaActual(): number {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), 0, 1);
    const pastDays = (today.getTime() - firstDay.getTime()) / 86400000;
    return Math.ceil((pastDays + firstDay.getDay() + 1) / 7);
  }

  manejarErrorImagen(event: any) {
    event.target.src = 'assets/plato-default.png';
  }
}
