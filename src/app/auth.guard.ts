import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { Observable, from } from 'rxjs';
import { map, take, mergeMap } from 'rxjs/operators';
import { AuthService } from './firebase/auth.service';
import { FirestoreService } from './firebase/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.authState$.pipe(
      take(1),
      mergeMap(user => {
        // No user logged in
        if (!user) {
          this.router.navigate(['/inicio-de-sesion']);
          return from(Promise.resolve(false));
        }

        // Check user role if specified in route data
        return from(
          this.firestoreService.getUserData(user.uid).then(userData => {
            const expectedRole = route.data['expectedRole'];

            // If no role specified or role matches, allow access
            if (!expectedRole || userData.rol === expectedRole) {
              return true;
            }

            // Redirect if role doesn't match
            this.router.navigate(['/inicio-de-sesion']);
            return false;
          }).catch(error => {
            console.error('Error checking user role:', error);
            this.router.navigate(['/inicio-de-sesion']);
            return false;
          })
        );
      })
    );
  }
}
