import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../firebase/firestore.service';
import { AuthService } from '../../firebase/auth.service';
import { Tarea } from '../../firebase/firestore.service';

@Component({
  selector: 'app-trabajador',
  templateUrl: './trabajador.page.html',
  styleUrls: ['./trabajador.page.scss'],
})
export class TrabajadorPage implements OnInit {
  tareas: (Tarea & { expanded?: boolean })[] = [];
  currentUserId: string = '';

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    const user = await this.authService.getCurrentUser();
    if (user) {
      this.currentUserId = user.uid;
      this.cargarTareas();
    }
  }

  cargarTareas() {
    this.firestoreService.getTareasPendientes().subscribe(tareas => {
      this.tareas = tareas.map(tarea => ({ ...tarea, expanded: false }));
    });
  }

  async aceptarTarea(tarea: Tarea) {
    const user = await this.authService.getCurrentUser();
    if (user) {
      await this.firestoreService.tomarTarea(tarea.id!, user);
    }
  }

  async completarTarea(tarea: Tarea) {
    if (tarea.id) {
      await this.firestoreService.actualizarEstadoTarea(tarea.id, 'completada');
    }
  }
}
