import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InicioDeSesionPage } from './inicio-de-sesion.page';

const routes: Routes = [
  {
    path: '',
    component: InicioDeSesionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InicioDeSesionPageRoutingModule {}
