import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { ApiService } from '../../core/services/api.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'; 
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  private apiService = inject(ApiService);
  private cd = inject(ChangeDetectorRef); 
  
  usuario: any = null;
  asistencia = { lunes: false, martes: false, miercoles: false, jueves: false, viernes: false };
  loading = true;

  ngOnInit() {
    const userLocal = localStorage.getItem('usuario');
    if (userLocal) {
      const userObj = JSON.parse(userLocal);
      this.cargarUsuario(userObj.id);
    }
  }

  cargarUsuario(id: number) {
    this.loading = true;
    this.apiService.get(`usuarios/${id}`)
      .pipe(finalize(() => { 
          this.loading = false; 
          this.cd.detectChanges();
      }))
      .subscribe({
        next: (data: any) => {
          this.usuario = data;
          this.asistencia = {
            lunes: data.asiste_lunes === 1,
            martes: data.asiste_martes === 1,
            miercoles: data.asiste_miercoles === 1,
            jueves: data.asiste_jueves === 1,
            viernes: data.asiste_viernes === 1
          };
        },
        error: (err) => console.error(err)
      });
  }

  guardarAsistencia() {
    if (!this.usuario) return;
    this.apiService.put(`usuarios/${this.usuario.id}/asistencia`, this.asistencia).subscribe({
      next: () => alert('¡Asistencia guardada!'),
      error: () => alert('Error al guardar')
    });
  }
}