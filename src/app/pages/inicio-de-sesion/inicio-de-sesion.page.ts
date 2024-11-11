import { Component } from '@angular/core';
import { AuthService } from '../../firebase/auth.service';
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
    private router: Router
  ) {}

  async onSubmit() {
    try {
      await this.authService.login(this.email, this.password);
      await this.router.navigate(['/inicio-de-sesion']);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  }

  irARegistro() {
    this.router.navigate(['/registrarse']);
  }
}
