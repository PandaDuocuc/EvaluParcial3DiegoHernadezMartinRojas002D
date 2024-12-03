import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { FirestoreService, UserData } from './firestore.service';
import { Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * Observable que emite el estado de autenticación actual del usuario
   */
  authState$: Observable<firebase.User | null>;

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private firestoreService: FirestoreService
  ) {
    this.authState$ = this.auth.authState.pipe(
      tap(user => {
        console.log('Estado de autenticación:', user ? 'Autenticado' : 'No autenticado');
      })
    );
  }

  /**
   * Obtiene el usuario actualmente autenticado
   * @returns Promesa con el usuario actual o null si no hay sesión
   */
  getCurrentUser(): Promise<firebase.User | null> {
    return this.auth.currentUser;
  }

  /**
   * Registra un nuevo usuario en Firebase Auth
   * @param email Correo electrónico del usuario
   * @param password Contraseña del usuario
   * @param username Nombre de usuario
   * @returns Promesa con las credenciales del usuario creado
   */
  async register(email: string, password: string, username: string): Promise<firebase.auth.UserCredential> {
    try {
      console.log('Iniciando registro de usuario:', email);
      const result = await this.auth.createUserWithEmailAndPassword(email, password);

      if (result.user) {
        await result.user.updateProfile({
          displayName: username
        });
      }

      return result;
    } catch (error) {
      console.error('Error en registro:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Inicia sesión con email y contraseña
   * @param email Correo electrónico del usuario
   * @param password Contraseña del usuario
   * @returns Promesa con las credenciales del usuario autenticado
   */
  async login(email: string, password: string): Promise<firebase.auth.UserCredential> {
    try {
      console.log('Iniciando login:', email);
      const result = await this.auth.signInWithEmailAndPassword(email, password);
      console.log('Login exitoso:', result.user?.uid);
      return result;
    } catch (error) {
      console.error('Error en login:', error);
      throw this.handleAuthError(error);
    }
  }

  async logout(): Promise<void> {
    try {
      await this.auth.signOut();
      console.log('Logout exitoso');
      // Usar setTimeout para asegurar que el cierre de sesión se complete
      setTimeout(() => {
        this.router.navigate(['/inicio-de-sesion']);
      }, 100);
    } catch (error) {
      console.error('Error en logout:', error);
      throw this.handleAuthError(error);
    }
  }

  /**
   * Verifica si hay un usuario autenticado
   * @returns Observable que emite true si hay un usuario autenticado
   */
  isAuthenticated(): Observable<boolean> {
    return this.authState$.pipe(
      map(user => user !== null)
    );
  }

  /**
   * Obtiene el rol del usuario actual desde Firestore
   * @returns Promesa con el rol del usuario o null si no existe
   */
  async getCurrentUserRole(): Promise<string | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    try {
      const userData = await this.firestoreService.getUserData(user.uid);
      return userData?.rol || null;
    } catch (error) {
      console.error('Error al obtener rol del usuario:', error);
      return null;
    }
  }

  /**
   * Maneja y formatea los errores de autenticación
   * @param error Error recibido de Firebase Auth
   * @returns Error formateado con mensaje amigable
   */
  private handleAuthError(error: any): Error {
    let message = 'Error de autenticación';

    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          message = 'El correo electrónico ya está en uso';
          break;
        case 'auth/invalid-email':
          message = 'Correo electrónico inválido';
          break;
        case 'auth/operation-not-allowed':
          message = 'Operación no permitida';
          break;
        case 'auth/weak-password':
          message = 'La contraseña debe tener mínimo 6 caracteres';
          break;
        case 'auth/user-disabled':
          message = 'Usuario deshabilitado';
          break;
        case 'auth/user-not-found':
          message = 'Usuario no encontrado';
          break;
        case 'auth/wrong-password':
          message = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-credential':
          message = 'Correo o contraseña incorrectos. Por favor, verifica tus credenciales.';
          break;
        default:
          message = error.message || 'Error desconocido';
      }
    }

    return new Error(message);
  }
}
