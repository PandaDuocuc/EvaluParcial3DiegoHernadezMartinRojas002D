import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth: AngularFireAuth,
    private router: Router
  ) {}

  async getCurrentUser() {
    return await this.auth.currentUser;
  }

  async register(email: string, password: string, username: string) {
    try {
      const result = await this.auth.createUserWithEmailAndPassword(email, password);
      await result.user?.updateProfile({
        displayName: username
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string) {
    try {
      return await this.auth.signInWithEmailAndPassword(email, password);
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    try {
      await this.auth.signOut();
      this.router.navigate(['/inicio-de-sesion']);
    } catch (error) {
      throw error;
    }
  }
}
