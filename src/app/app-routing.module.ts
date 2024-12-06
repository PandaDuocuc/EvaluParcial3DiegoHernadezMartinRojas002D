import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio-de-sesion',
    pathMatch: 'full'
  },
  {
    path: 'inicio-de-sesion',
    loadChildren: () => import('./pages/inicio-de-sesion/inicio-de-sesion.module').then( m => m.InicioDeSesionPageModule)
  },
  {
    path: 'registrarse',
    loadChildren: () => import('./pages/registrarse/registrarse.module').then( m => m.RegistrarsePageModule)
  },
  {
    path: 'cierre-de-sesion',
    loadChildren: () => import('./pages/cierre-de-sesion/cierre-de-sesion.module').then( m => m.CierreDeSesionPageModule)
  },
  {
    path: 'jefe',
    loadChildren: () => import('./pages/jefe/jefe.module').then( m => m.JefePageModule),
    canActivate: [AuthGuard],
    data: { expectdRole: "jefe" } // Especifica rol esperado
  },
  {
    path: 'trabajador',
    loadChildren: () => import('./pages/trabajador/trabajador.module').then( m => m.TrabajadorPageModule),
    canActivate: [AuthGuard],
    data: { expectdRole: "trabajador" } // Especifica rol esperado
  },
  {
    path: 'crear-tarea',
    loadChildren: () => import('./pages/crear-tarea/crear-tarea.module').then( m => m.CrearTareaPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
