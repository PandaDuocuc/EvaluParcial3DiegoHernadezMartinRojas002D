import { Component } from '@angular/core';
import { AuthService } from '../../firebase/auth.service';
import { FirestoreService } from '../../firebase/firestore.service';
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

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  async onSubmit() {
    try {
      const result = await this.authService.register(this.email, this.password, this.username);
      if (result.user) {
        await this.firestoreService.saveUserData(result.user.uid, {
          username: this.username,
          email: this.email,
          rol: this.rol
        });
        await this.router.navigate(['/inicio-de-sesion']);
      }
    } catch (error) {
      console.error('Error al registrar:', error);
    }
  }

  irALogin() {
    this.router.navigate(['/inicio-de-sesion']);
  }
}
