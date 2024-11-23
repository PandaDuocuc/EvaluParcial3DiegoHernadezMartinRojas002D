import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-crear-tarea',
  templateUrl: './crear-tarea.page.html',
  styleUrls: ['./crear-tarea.page.scss'],
})
export class CrearTareaPage {
  titulo: string = '';
  descripcion: string = '';

  constructor(private modalController: ModalController) {}

  crearTarea() {
    if (this.titulo && this.descripcion) {
      this.modalController.dismiss({
        titulo: this.titulo,
        descripcion: this.descripcion
      });
    }
  }
}
