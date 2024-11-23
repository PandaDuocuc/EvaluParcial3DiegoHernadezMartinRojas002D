import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { JefePage } from './jefe.page';

const routes: Routes = [
  {
    path: '',
    component: JefePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JefePageRoutingModule {}
