import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../firebase/auth.service';
import { FirestoreService, Tarea } from '../../firebase/firestore.service';
import { Subscription } from 'rxjs';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-trabajador',
  templateUrl: './trabajador.page.html',
  styleUrls: ['./trabajador.page.scss'],
})
export class TrabajadorPage implements OnInit, OnDestroy {
  currentUser: firebase.User | null = null;
  tareas: Tarea[] = [];
  loading: boolean = true;
  error: string | null = null;
  titulo: string = 'Panel de Trabajador';
  private authSubscription?: Subscription;
  private tareasSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit() {
    this.loading = true;
    this.authSubscription = this.authService.authState$.subscribe({
      next: (user) => {
        this.currentUser = user;
        if (user) {
          this.cargarTareas();
        } else {
          this.error = 'No hay usuario autenticado';
          this.loading = false;
        }
      },
      error: (error) => {
        console.error('Error en la autenticación:', error);
        this.error = 'Error al verificar la autenticación';
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
    this.tareasSubscription?.unsubscribe();
  }

  private cargarTareas() {
    if (!this.currentUser) return;

    if (this.tareasSubscription) {
      this.tareasSubscription.unsubscribe();
    }

    this.tareasSubscription = this.firestoreService.getTareasPorTrabajador(this.currentUser.uid)
      .subscribe({
        next: (tareas) => {
          this.tareas = tareas;
          this.error = null;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar tareas:', error);
          this.error = 'Error al cargar las tareas';
          this.loading = false;
        }
      });
  }

  async logout() {
    try {
      this.loading = true;
      await this.authService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      this.error = 'Error al cerrar sesión';
    } finally {
      this.loading = false;
    }
  }
}
