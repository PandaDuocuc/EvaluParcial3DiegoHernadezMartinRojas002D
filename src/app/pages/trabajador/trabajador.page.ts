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
  tareas: Tarea[] = [];

  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarTareas();
  }

  async cargarTareas() {
    this.firestoreService.getTareasPendientes().subscribe(tareas => {
      this.tareas = tareas;
    });
  }

  async tomarTarea(tarea: Tarea) {
    const user = await this.authService.getCurrentUser();
    if (user) {
      await this.firestoreService.tomarTarea(tarea.id!, user);
    }
  }

  logout() {
    this.authService.logout();
  }
}
