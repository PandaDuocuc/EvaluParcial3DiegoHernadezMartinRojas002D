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
  username: string = '';
  email: string = '';
  password: string = '';
  rol: 'jefe' | 'trabajador' = 'trabajador';
  error: string = '';
  loading: boolean = false;

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

    this.loading = true;
    this.error = '';

    try {
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
    }
  }

  irALogin() {
    this.router.navigate(['/inicio-de-sesion']);
  }
}
