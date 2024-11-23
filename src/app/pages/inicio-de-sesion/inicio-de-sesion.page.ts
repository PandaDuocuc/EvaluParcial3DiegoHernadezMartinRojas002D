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
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  async onSubmit() {
    try {
      const userCredential = await this.authService.login(this.email, this.password);

      if (userCredential.user) {
        const userData = await this.firestoreService.getUserData(userCredential.user.uid);

        if (userData.rol === 'jefe') {
          this.router.navigate(['/jefe']);
        } else if (userData.rol === 'trabajador') {
          this.router.navigate(['/trabajador']);
        } else {
          console.error('Usuario sin rol definido');
        }
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }

  irARegistro() {
    this.router.navigate(['/registrarse']);
  }
}
