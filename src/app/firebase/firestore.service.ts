import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

interface UserData {
  username: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private firestore: AngularFirestore) {}

  async saveUserData(uid: string, userData: UserData) {
    try {
      const enrichedUserData = {
        ...userData,
        uid: uid
      };

      return await this.firestore.collection('usuarios').doc(uid).set(enrichedUserData, { merge: true });
    } catch (error) {
      console.error('Error saving user data to Firestore:', error);
      throw new Error('No se pudieron guardar los datos del usuario. Por favor, intenta nuevamente.');
    }
  }
}
