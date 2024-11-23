import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../firebase/firestore.service';
import { AuthService } from '../../firebase/auth.service';
import { ModalController } from '@ionic/angular';
import { Tarea } from '../../firebase/firestore.service';
import { CrearTareaPage } from '../crear-tarea/crear-tarea.page';

@Component({
  selector: 'app-jefe',
  templateUrl: './jefe.page.html',
  styleUrls: ['./jefe.page.scss'],
})
export class JefePage implements OnInit {
  tareas: Tarea[] = [];

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.cargarTareas();
  }

  async cargarTareas() {
    const user = await this.authService.getCurrentUser();
    if (user) {
      this.firestoreService.getTareasPorJefe(user.uid).subscribe(tareas => {
        this.tareas = tareas;
      });
    }
  }

  async abrirModalCrearTarea() {
    const modal = await this.modalController.create({
      component: CrearTareaPage
    });

    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        const user = await this.authService.getCurrentUser();
        if (user) {
          const nuevaTarea: Omit<Tarea, 'id'> = {
            titulo: result.data.titulo,
            descripcion: result.data.descripcion,
            asignado_a: '', // Inicialmente vacío
            creado_por: user.uid,
            estado: 'pendiente',
            fecha_creacion: new Date()
          };

          await this.firestoreService.crearTarea(nuevaTarea);
        }
      }
    });

    return await modal.present();
  }

  logout() {
    this.authService.logout();
  }
}
