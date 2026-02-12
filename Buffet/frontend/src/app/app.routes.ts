import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { MenuComponent } from './features/menu/menu.component';
import { HistorialPedidosComponent } from './features/pedidos/historial-pedidos/historial-pedidos.component';
import { PedidosAdminComponent } from './features/admin/pedidos-admin/pedidos-admin.component';
import { GestionPlatosComponent } from './features/admin/gestion-platos/gestion-platos.component';
import { PlanificadorMenuComponent } from './features/admin/planificador-menu/planificador-menu.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent },
    { path: 'menu', component: MenuComponent },
    { path: 'mis-pedidos', component: HistorialPedidosComponent },
    { path: 'admin/pedidos', component: PedidosAdminComponent },
    { path: 'admin/platos', component: GestionPlatosComponent },
    { path: 'admin/planificador', component: PlanificadorMenuComponent }
];

