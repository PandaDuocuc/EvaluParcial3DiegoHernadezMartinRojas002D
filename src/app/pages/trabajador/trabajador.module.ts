import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TrabajadorPageRoutingModule } from './trabajador-routing.module';

import { TrabajadorPage } from './trabajador.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TrabajadorPageRoutingModule,
    SharedModule
  ],
  declarations: [TrabajadorPage]
})
export class TrabajadorPageModule {}
