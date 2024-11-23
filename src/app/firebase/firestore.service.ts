import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export interface UserData {
  username: string;
  email: string;
  rol?: 'jefe' | 'trabajador';
}

export interface Tarea {
  id?: string;
  titulo: string;
  descripcion: string;
  asignado_a: string;
  creado_por: string;
  estado: 'pendiente' | 'completada' | 'en_progreso';
  fecha_creacion: Date;
  nombre_trabajador?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  async getUserData(uid: string): Promise<UserData> {
    const userDocRef = this.firestore.collection('usuarios').doc(uid);
    const userDoc = await userDocRef.get().toPromise();

    if (!userDoc || !userDoc.exists) {
      throw new Error('User document not found');
    }

    return userDoc.data() as UserData;
  }

  async saveUserData(uid: string, userData: UserData) {
    try {
      const enrichedUserData = {
        ...userData,
        uid: uid
      };
      return await this.firestore.collection('usuarios').doc(uid).set(enrichedUserData, { merge: true });
    } catch (error) {
      console.error('Error saving user data to Firestore:', error);
      throw new Error('No se pudieron guardar los datos del usuario. Por favor, intenta nuevamente.');
    }
  }

  async crearTarea(tarea: Omit<Tarea, 'id'>) {
    return this.firestore.collection('tareas').add(tarea);
  }

  getTareasPorTrabajador(trabajadorId: string): Observable<Tarea[]> {
    return this.firestore.collection('tareas', ref =>
      ref.where('asignado_a', '==', trabajadorId)
    ).valueChanges({ idField: 'id' }) as Observable<Tarea[]>;
  }

  getTareasPorJefe(jefeId: string): Observable<Tarea[]> {
    return this.firestore.collection('tareas', ref =>
      ref.where('creado_por', '==', jefeId)
    ).valueChanges({ idField: 'id' }) as Observable<Tarea[]>;
  }

  getTareasPendientes(): Observable<Tarea[]> {
    return this.firestore.collection('tareas', ref =>
      ref.where('estado', '==', 'pendiente')
    ).valueChanges({ idField: 'id' }) as Observable<Tarea[]>;
  }

  async actualizarEstadoTarea(tareaId: string, estado: 'pendiente' | 'completada' | 'en_progreso') {
    return this.firestore.collection('tareas').doc(tareaId).update({ estado });
  }

  async tomarTarea(tareaId: string, user: any) {
    return this.firestore.collection('tareas').doc(tareaId).update({
      estado: 'en_progreso',
      asignado_a: user.uid,
      nombre_trabajador: user.displayName
    });
  }
}
