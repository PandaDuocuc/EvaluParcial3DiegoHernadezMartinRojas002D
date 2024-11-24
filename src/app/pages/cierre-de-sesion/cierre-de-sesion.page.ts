import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../firebase/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cierre-de-sesion',
  templateUrl: './cierre-de-sesion.page.html',
  styleUrls: ['./cierre-de-sesion.page.scss'],
})
export class CierreDeSesionPage implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Al iniciar el componente, espera 2 segundos y cierra la sesión
   */
  ngOnInit() {
    setTimeout(async () => {
      try {
        await this.authService.logout();
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    }, 2000);
  }
}
