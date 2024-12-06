import { Component } from '@angular/core';
import { AuthService } from './firebase/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.initializeAuthListener();
  }

  private initializeAuthListener() {
    this.authService.authState$.subscribe(user => {
      if (!user) {
        this.router.navigate(['/inicio-de-sesion']);
      }
    });
  }
}
