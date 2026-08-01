import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // NUEVO: Si estamos renderizando en el servidor (SSR), dejamos pasar la ruta.
  // La verdadera validación ocurrirá milisegundos después en el navegador.
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // Si estamos en el navegador, validamos normalmente
  if (authService.isAuthenticated()) {
    return true; 
  }

  return router.createUrlTree(['/login']);
};