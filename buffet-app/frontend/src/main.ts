import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component'; // <--- ¡Aquí está el cambio clave!

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));