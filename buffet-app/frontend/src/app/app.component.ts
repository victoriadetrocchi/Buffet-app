import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // Necesario para que funcionen las rutas
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent { // <--- Tiene que llamarse AppComponent
  title = 'frontend';
}