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
  // Arreglo para almacenar las tareas
  tareas: Tarea[] = [];

  // Constructor que inyecta los servicios necesarios
  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private modalController: ModalController
  ) {}

  // Método que se ejecuta al inicializar el componente
  ngOnInit() {
    this.cargarTareas(); // Carga las tareas al inicio
  }

  // Carga las tareas creadas por el jefe actual
  async cargarTareas() {
    const user = await this.authService.getCurrentUser();
    if (user) {
      // Se suscribe a actualizaciones en tiempo real de las tareas
      this.firestoreService.getTareasPorJefe(user.uid).subscribe(tareas => {
        this.tareas = tareas;
      });
    }
  }

  // Abre el modal para crear una nueva tarea
  async abrirModalCrearTarea() {
    const modal = await this.modalController.create({
      component: CrearTareaPage
    });

    // Maneja el cierre del modal y la creación de tareas
    modal.onDidDismiss().then(async (result) => {
      if (result.data) {
        const user = await this.authService.getCurrentUser();
        if (user) {
          // Crea el objeto de nueva tarea
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
}
