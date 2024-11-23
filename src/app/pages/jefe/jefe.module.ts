import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JefePageRoutingModule } from './jefe-routing.module';

import { JefePage } from './jefe.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JefePageRoutingModule,
    SharedModule
  ],
  declarations: [JefePage]
})
export class JefePageModule {}
