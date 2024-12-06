import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirestoreService } from '../../firebase/firestore.service';
import { AuthService } from '../../firebase/auth.service';
import { ModalController } from '@ionic/angular';
import { Tarea } from '../../firebase/firestore.service';
import { CrearTareaPage } from '../crear-tarea/crear-tarea.page';
import { Subscription } from 'rxjs';
import { catchError, retryWhen, delay, take, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';  // Añadido para navegación

@Component({
  selector: 'app-jefe',
  templateUrl: './jefe.page.html',
  styleUrls: ['./jefe.page.scss'],
})
export class JefePage implements OnInit, OnDestroy {
  // Arreglo para almacenar las tareas
  tareas: Tarea[] = [];

  // Suscripción para manejar la carga de tareas
  private tareasSubscription: Subscription | null = null;
  private reconnectAttempts = 0;

  // Constructor que inyecta los servicios necesarios
  constructor(
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private modalController: ModalController,
    private router: Router  // Añadido para navegación
  ) {}

  // Método que se ejecuta al inicializar el componente
  async ngOnInit() {
    await this.cargarTareas(); // Usa await para asegurar la carga

    // Escucha cambios de conectividad
    this.setupConnectivityListener();
  }

  setupConnectivityListener() {
    if ('onLine' in navigator) {
      window.addEventListener('online', () => this.cargarTareas());
    }
  }

  // Carga las tareas creadas por el jefe actual
  async cargarTareas() {
    try {
      const user = await this.authService.getCurrentUser();
      if (user) {
        // Cancela la suscripción previa
        this.tareasSubscription?.unsubscribe();

        this.tareasSubscription = this.firestoreService
          .getTareasPorJefe(user.uid)
          .pipe(
            // Añade reintento con backoff
            retryWhen(errors =>
              errors.pipe(
                delay(1000),
                take(3),
                tap(() => this.reconnectAttempts++)
              )
            ),
            catchError(error => {
              console.error('Error al cargar tareas:', error);

              // Recupera tareas en caché
              const cachedTareas = localStorage.getItem(`tareas_${user.uid}`);
              if (cachedTareas) {
                this.tareas = JSON.parse(cachedTareas);
              }

              return of([]);
            })
          )
          .subscribe({
            next: (tareas) => {
              this.tareas = tareas;
              // Guarda en caché local
              localStorage.setItem(`tareas_${user.uid}`, JSON.stringify(tareas));
              this.reconnectAttempts = 0;
            },
            error: (error) => {
              console.error('Error en suscripción de tareas:', error);
            }
          });
      }
    } catch (error) {
      console.error('Error al obtener usuario o cargar tareas:', error);
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
        try {
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
            // Opcional: recargar tareas después de crear
            await this.cargarTareas();
          }
        } catch (error) {
          console.error('Error al crear tarea:', error);
        }
      }
    });

    return await modal.present();
  }

  // Método para refrescar tareas manualmente
  async refrescarTareas(event?: any) {
    await this.cargarTareas();
    if (event) {
      event.target.complete();
    }
  }

  // Implementa OnDestroy para limpiar suscripciones
  ngOnDestroy() {
    // Limpia la suscripción
    this.tareasSubscription?.unsubscribe();

    // Elimina el listener de conectividad
    if ('onLine' in navigator) {
      window.removeEventListener('online', () => this.cargarTareas());
    }
  }
}
