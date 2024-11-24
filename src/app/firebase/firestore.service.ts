import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

// Interfaces que definen la estructura de los datos
export interface UserData {
  username: string;
  email: string;
  uid: string;
  rol?: 'jefe' | 'trabajador'; // Rol opcional que determina los permisos del usuario
}

export interface Tarea {
  id?: string;
  titulo: string;
  descripcion: string;
  asignado_a: string; // ID del trabajador asignado
  creado_por: string; // ID del jefe que creó la tarea
  estado: 'pendiente' | 'en progreso' | 'completada';
  fecha_creacion: Date;
  nombre_trabajador?: string; // Nombre del trabajador asignado
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  /**
   * Guarda o actualiza los datos de un usuario en Firestore
   * @param uid ID único del usuario
   * @param userData Datos del usuario a guardar
   */
  async saveUserData(uid: string, userData: UserData) {
    try {
      console.log('Guardando datos de usuario:', uid);
      return await this.firestore.collection('usuarios').doc(uid).set(userData, { merge: true });
    } catch (error) {
      console.error('Error guardando datos de usuario:', error);
      throw error;
    }
  }

  /**
   * Obtiene los datos de un usuario específico
   * @param uid ID único del usuario
   * @returns Promesa con los datos del usuario
   */
  async getUserData(uid: string): Promise<UserData> {
    try {
      console.log('Obteniendo datos de usuario:', uid);
      const doc = await this.firestore.collection('usuarios').doc(uid).get().toPromise();
      if (!doc?.exists) {
        throw new Error('Usuario no encontrado');
      }
      return doc.data() as UserData;
    } catch (error) {
      console.error('Error obteniendo datos de usuario:', error);
      throw error;
    }
  }

  /**
   * Crea una nueva tarea en la base de datos
   * @param tarea Datos de la tarea a crear (sin ID)
   * @returns Promesa con la referencia a la tarea creada
   */
  async crearTarea(tarea: Omit<Tarea, 'id'>) {
    try {
      console.log('Creando nueva tarea');
      const result = await this.firestore.collection('tareas').add(tarea);
      console.log('Tarea creada:', result.id);
      return result;
    } catch (error) {
      console.error('Error creando tarea:', error);
      throw error;
    }
  }

  /**
   * Obtiene las tareas asignadas a un trabajador específico
   * @param trabajadorId ID del trabajador
   * @returns Observable con array de tareas
   */
  getTareasPorTrabajador(trabajadorId: string): Observable<Tarea[]> {
    console.log('Consultando tareas del trabajador:', trabajadorId);
    return this.firestore.collection<Tarea>('tareas', ref =>
      ref.where('asignado_a', '==', trabajadorId)
    ).valueChanges({ idField: 'id' });
  }

  /**
   * Obtiene las tareas creadas por un jefe específico
   * @param jefeId ID del jefe
   * @returns Observable con array de tareas
   */
  getTareasPorJefe(jefeId: string): Observable<Tarea[]> {
    console.log('Consultando tareas creadas por jefe:', jefeId);
    return this.firestore.collection<Tarea>('tareas', ref =>
      ref.where('creado_por', '==', jefeId)
    ).valueChanges({ idField: 'id' });
  }

  /**
   * Obtiene todas las tareas del sistema ordenadas por fecha de creación
   * @returns Observable con array de todas las tareas ordenadas por fecha descendente
   * Útil para vistas administrativas o resúmenes generales
   */
  getAllTareas(): Observable<Tarea[]> {
    return this.firestore.collection<Tarea>('tareas', ref =>
      ref.orderBy('fecha_creacion', 'desc')
    ).valueChanges({ idField: 'id' });
  }

  /**
   * Obtiene todas las tareas disponibles (pendientes)
   * @returns Observable con array de tareas disponibles
   */
  getTareasDisponibles(): Observable<Tarea[]> {
    return this.firestore.collection<Tarea>('tareas', ref =>
      ref.where('estado', '==', 'pendiente')
         .orderBy('fecha_creacion', 'desc')
    ).valueChanges({ idField: 'id' });
  }

  /**
   * Permite a un trabajador tomar una tarea
   * @param tareaId ID de la tarea
   * @param user Usuario que toma la tarea
   */
  async tomarTarea(tareaId: string, user: any) {
    try {
      console.log('Tomando tarea:', tareaId, 'por usuario:', user.uid);
      return await this.firestore.collection('tareas').doc(tareaId).update({
        estado: 'en progreso',
        asignado_a: user.uid,
        nombre_trabajador: user.displayName
      });
    } catch (error) {
      console.error('Error al tomar tarea:', error);
      throw error;
    }
  }

  /**
   * Marca una tarea como completada
   * @param tareaId ID de la tarea a completar
   */
  async completarTarea(tareaId: string) {
    try {
      console.log('Completando tarea:', tareaId);
      return await this.firestore.collection('tareas').doc(tareaId).update({
        estado: 'completada'
      });
    } catch (error) {
      console.error('Error al completar tarea:', error);
      throw error;
    }
  }


  /**
   * Actualiza el estado de una tarea específica
   * @param tareaId ID de la tarea a actualizar
   * @param estado Nuevo estado de la tarea (pendiente, completada o en progreso)
   * @returns Promesa que resuelve cuando se actualiza el estado
   * @throws Error si falla la actualización del estado
   */
  async actualizarEstadoTarea(tareaId: string, estado: 'pendiente' | 'completada' | 'en progreso') {
    try {
      console.log('Actualizando estado de tarea:', tareaId, 'a:', estado);
      return await this.firestore.collection('tareas').doc(tareaId).update({ estado });
    } catch (error) {
      console.error('Error al actualizar estado de tarea:', error);
      throw error;
    }
  }
}
