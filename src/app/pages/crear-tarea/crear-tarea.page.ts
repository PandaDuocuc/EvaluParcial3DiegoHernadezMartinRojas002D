import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-crear-tarea',
  templateUrl: './crear-tarea.page.html',
  styleUrls: ['./crear-tarea.page.scss'],
})
export class CrearTareaPage {
  /** Título de la nueva tarea */
  titulo: string = '';
  /** Descripción de la nueva tarea */
  descripcion: string = '';

  constructor(private modalController: ModalController) {}

  /**
   * Crea una nueva tarea y cierra el modal
   * retornando los datos de la tarea
   */
  crearTarea() {
    if (this.titulo && this.descripcion) {
      this.modalController.dismiss({
        titulo: this.titulo,
        descripcion: this.descripcion
      });
    }
  }
}
