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

  // 🔄 CAMBIO: Estructura para agrupar por días
  menuPorDia: any = {}; 
  diasOrdenados: string[] = [];
  
  carrito: any[] = [];
  loading = true;
  total = 0;

  ngOnInit() {
    this.cargarMenu();
  }

  cargarMenu() {
    this.loading = true;
    
    // 🔄 CAMBIO: Usamos la ruta nueva del planificador para ver SOLO lo asignado
    this.apiService.get('planificador/vigente').subscribe({
      next: (data: any) => {
        // Procesamos los datos para ordenarlos por día
        this.agruparPlatos(data);
        
        this.loading = false;
        this.cd.detectChanges(); 
      },
      error: (err: any) => {
        console.error('Error al cargar menú', err);
        this.loading = false;
        alert('Error de conexión o no hay menú asignado.');
        this.cd.detectChanges();
      }
    });
  }

  // 👇 NUEVA FUNCIÓN: Ordena la lista plana que viene del server en días
  agruparPlatos(data: any[]) {
    this.menuPorDia = {};
    this.diasOrdenados = [];

    data.forEach(item => {
      // item.nombre_dia viene de la consulta SQL nueva
      if (!this.menuPorDia[item.nombre_dia]) {
        this.menuPorDia[item.nombre_dia] = [];
        this.diasOrdenados.push(item.nombre_dia);
      }
      this.menuPorDia[item.nombre_dia].push(item);
    });

    // Eliminamos duplicados en los días por seguridad
    this.diasOrdenados = [...new Set(this.diasOrdenados)];
  }

  agregarAlCarrito(plato: any) {
    const itemExistente = this.carrito.find(item => item.id === plato.id);

    // Verificamos stock actual vs cantidad en carrito
    if (itemExistente) {
      if (itemExistente.cantidad < plato.stock) {
        itemExistente.cantidad++;
      } else {
        alert(`¡No hay más stock! Solo quedan ${plato.stock} unidades.`);
      }
    } else {
      // Si es el primero, verificamos que haya al menos 1
      if (plato.stock > 0) {
        this.carrito.push({ ...plato, cantidad: 1 });
      } else {
        alert("Producto agotado.");
      }
    }
    this.calcularTotal();
    this.cd.detectChanges();
  }

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
      semana: this.obtenerSemanaActual(), // Esto está bien dejarlo
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
        this.cargarMenu(); // Recargamos para actualizar el stock visualmente
      },
      error: (err) => {
        console.error(err);
        alert("Error al pedir: " + (err.error?.message || "Intente nuevamente"));
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