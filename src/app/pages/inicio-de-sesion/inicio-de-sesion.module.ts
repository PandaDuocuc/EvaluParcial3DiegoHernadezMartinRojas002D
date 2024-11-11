import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InicioDeSesionPageRoutingModule } from './inicio-de-sesion-routing.module';

import { InicioDeSesionPage } from './inicio-de-sesion.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InicioDeSesionPageRoutingModule,
    SharedModule
  ],
  declarations: [InicioDeSesionPage]
})
export class InicioDeSesionPageModule {}
