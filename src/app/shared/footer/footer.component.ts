import { Component } from '@angular/core';
import { AuthService } from '../../firebase/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async logout() {
    try {
      await this.router.navigate(['/cierre-de-sesion']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
