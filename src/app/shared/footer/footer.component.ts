import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  constructor(
    private router: Router
  ) {}

  // Navega a cierre-de-sesion para cerrar sesión
  async logout() {
    try {
      await this.router.navigate(['/cierre-de-sesion']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
