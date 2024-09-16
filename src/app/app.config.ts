import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'little-linguist-5cbbc',
        appId: '1:4961648630:web:3564684eba2513dead11d7',
        storageBucket: 'little-linguist-5cbbc.appspot.com',
        apiKey: 'AIzaSyAHu_bzNi5GEIA8mzruJorg9yBl8qCG2KU',
        authDomain: 'little-linguist-5cbbc.firebaseapp.com',
        messagingSenderId: '4961648630',
      })
    ),
    provideFirestore(() => getFirestore()),
  ],
};
