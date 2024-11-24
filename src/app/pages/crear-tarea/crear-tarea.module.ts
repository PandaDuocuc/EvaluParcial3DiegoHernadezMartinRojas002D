import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CrearTareaPageRoutingModule } from './crear-tarea-routing.module';

import { CrearTareaPage } from './crear-tarea.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CrearTareaPageRoutingModule,
    SharedModule
  ],
  declarations: [CrearTareaPage]
})
export class CrearTareaPageModule {}
