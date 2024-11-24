import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../firebase/auth.service';
import { FirestoreService, Tarea } from '../../firebase/firestore.service';
import { Subscription } from 'rxjs';
import firebase from 'firebase/compat/app';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-trabajador',
  templateUrl: './trabajador.page.html',
  styleUrls: ['./trabajador.page.scss'],
})
export class TrabajadorPage implements OnInit, OnDestroy {
  currentUser: firebase.User | null = null;
  tareas: Tarea[] = [];
  tareasDisponibles: Tarea[] = [];
  loading: boolean = true;
  error: string | null = null;
  titulo: string = 'Panel de Trabajador';
  selectedSegment: string = 'misTareas';

  private authSubscription?: Subscription;
  private tareasSubscription?: Subscription;
  private tareasDisponiblesSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loading = true;
    this.authSubscription = this.authService.authState$.subscribe({
      next: (user) => {
        this.currentUser = user;
        if (user) {
          this.cargarTareas();
          this.cargarTareasDisponibles();
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
    this.tareasDisponiblesSubscription?.unsubscribe();
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

  private cargarTareasDisponibles() {
    if (this.tareasDisponiblesSubscription) {
      this.tareasDisponiblesSubscription.unsubscribe();
    }

    this.tareasDisponiblesSubscription = this.firestoreService.getTareasDisponibles()
      .subscribe({
        next: (tareas) => {
          this.tareasDisponibles = tareas;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al cargar tareas disponibles:', error);
          this.loading = false;
        }
      });
  }

  async tomarTarea(tarea: Tarea) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Deseas tomar esta tarea?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aceptar',
          handler: async () => {
            try {
              this.loading = true;
              await this.firestoreService.tomarTarea(tarea.id!, this.currentUser);
              this.loading = false;
            } catch (error) {
              console.error('Error al tomar la tarea:', error);
              this.error = 'Error al tomar la tarea';
              this.loading = false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async completarTarea(tarea: Tarea) {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Has completado esta tarea?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: async () => {
            try {
              this.loading = true;
              await this.firestoreService.completarTarea(tarea.id!);
              this.loading = false;
            } catch (error) {
              console.error('Error al completar la tarea:', error);
              this.error = 'Error al completar la tarea';
              this.loading = false;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }
}
