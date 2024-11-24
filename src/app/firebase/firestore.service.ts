import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export interface UserData {
  username: string;
  email: string;
  uid: string;
  rol?: 'jefe' | 'trabajador';
}

export interface Tarea {
  id?: string;
  titulo: string;
  descripcion: string;
  asignado_a: string;
  creado_por: string;
  estado: 'pendiente' | 'en progreso' | 'completada';
  fecha_creacion: Date;
  nombre_trabajador?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  // Métodos para gestión de usuarios
  async saveUserData(uid: string, userData: UserData) {
    try {
      console.log('Guardando datos de usuario:', uid);
      return await this.firestore.collection('usuarios').doc(uid).set(userData, { merge: true });
    } catch (error) {
      console.error('Error guardando datos de usuario:', error);
      throw error;
    }
  }

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

  // Métodos para gestión de tareas
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

  getTareasPorTrabajador(trabajadorId: string): Observable<Tarea[]> {
    console.log('Consultando tareas del trabajador:', trabajadorId);
    return this.firestore.collection<Tarea>('tareas', ref =>
      ref.where('asignado_a', '==', trabajadorId)
    ).valueChanges({ idField: 'id' });
  }

  getTareasPorJefe(jefeId: string): Observable<Tarea[]> {
    console.log('Consultando tareas creadas por jefe:', jefeId);
    return this.firestore.collection<Tarea>('tareas', ref =>
      ref.where('creado_por', '==', jefeId)
    ).valueChanges({ idField: 'id' });
  }

  getAllTareas(): Observable<Tarea[]> {
    return this.firestore.collection<Tarea>('tareas', ref =>
      ref.orderBy('fecha_creacion', 'desc')
    ).valueChanges({ idField: 'id' });
  }

  getTareasDisponibles(): Observable<Tarea[]> {
    return this.firestore.collection<Tarea>('tareas', ref =>
      ref.where('estado', '==', 'pendiente')
         .orderBy('fecha_creacion', 'desc')
    ).valueChanges({ idField: 'id' });
  }

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
