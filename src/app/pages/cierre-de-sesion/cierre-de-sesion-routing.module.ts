import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CierreDeSesionPage } from './cierre-de-sesion.page';

const routes: Routes = [
  {
    path: '',
    component: CierreDeSesionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CierreDeSesionPageRoutingModule {}
