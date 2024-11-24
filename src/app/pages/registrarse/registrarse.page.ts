import { Component } from '@angular/core';
import { AuthService } from '../../firebase/auth.service';
import { FirestoreService, UserData } from '../../firebase/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
})
export class RegistrarsePage {
  /** Nombre de usuario */
  username: string = '';
  /** Email del nuevo usuario */
  email: string = '';
  /** Contraseña del nuevo usuario */
  password: string = '';
  /** Rol seleccionado para el usuario */
  rol: 'jefe' | 'trabajador' = 'trabajador';
  /** Mensaje de error si existe */
  error: string = '';
  /** Controla el cambio de registrarse a registrando... */
  loading: boolean = false;
  /** Controla la visibilidad del spinner de carga */
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private firestoreService: FirestoreService  // Añadido FirestoreService
  ) {}

  async onSubmit() {
    if (!this.username || !this.email || !this.password) {
      this.error = 'Por favor complete todos los campos';
      return;
    }

    this.isLoading = true;
    this.loading = true;
    this.error = '';

    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos
      // Crear el usuario en Firebase Auth
      const result = await this.authService.register(
        this.email,
        this.password,
        this.username
      );

      if (result.user) {
        // Crear/actualizar el documento del usuario en Firestore con el rol seleccionado
        const userData: UserData = {
          username: this.username,
          email: this.email,
          uid: result.user.uid,
          rol: this.rol  // Usar el rol seleccionado en el formulario
        };

        await this.firestoreService.saveUserData(result.user.uid, userData);
        await this.router.navigate(['/inicio-de-sesion']);
      }
    } catch (error: any) {
      console.error('Error en registro:', error);
      this.error = error.message || 'Error en el registro';
    } finally {
      this.loading = false;
      this.isLoading = false;
    }
  }

  /**
   * Navega a la página de inicio de sesión
   */
  irALogin() {
    this.router.navigate(['/inicio-de-sesion']);
  }
}
