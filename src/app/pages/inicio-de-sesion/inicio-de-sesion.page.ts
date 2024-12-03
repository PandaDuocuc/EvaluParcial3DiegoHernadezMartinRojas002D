import { Component } from '@angular/core';
import { AuthService } from '../../firebase/auth.service';
import { FirestoreService } from '../../firebase/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-de-sesion',
  templateUrl: './inicio-de-sesion.page.html',
  styleUrls: ['./inicio-de-sesion.page.scss'],
})
export class InicioDeSesionPage {
  /** Email ingresado por el usuario */
  email: string = '';
  /** Contraseña ingresada por el usuario */
  password: string = '';
  /** Controla la visibilidad del spinner de carga */
  isLoading: boolean = false;
  /** Mensaje de error para mostrar */
  error: string = '';

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  /**
   * Maneja el envío del formulario de inicio de sesión
   * Autentica al usuario y lo redirige según su rol
   */
  async onSubmit() {

    // Validar campos requeridos
    if (!this.email || !this.password) {
      this.error = 'Por favor complete todos los campos';
      return;
    }

    this.isLoading = true;
    this.error = ''; // Limpiar errores anteriores

    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Espera 2 segundos
      const userCredential = await this.authService.login(this.email, this.password);

      if (userCredential.user) {
        const userData = await this.firestoreService.getUserData(userCredential.user.uid);


        // Redirigir según el rol del usuario
        if (userData.rol === 'jefe') {
          this.router.navigate(['/jefe']);
        } else if (userData.rol === 'trabajador') {
          this.router.navigate(['/trabajador']);
        } else {
          console.error('Usuario sin rol definido');
        }

        // Limpiar el formulario después de un inicio de sesión exitoso
        this.email = '';
        this.password = '';
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error);
      this.error = error.message || 'Error al iniciar sesión';
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Navega a la página de registro
   */
  irARegistro() {
    this.router.navigate(['/registrarse']);
  }
}
