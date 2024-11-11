import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CierreDeSesionPageRoutingModule } from './cierre-de-sesion-routing.module';

import { CierreDeSesionPage } from './cierre-de-sesion.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CierreDeSesionPageRoutingModule,
    SharedModule
  ],
  declarations: [CierreDeSesionPage]
})
export class CierreDeSesionPageModule {}
