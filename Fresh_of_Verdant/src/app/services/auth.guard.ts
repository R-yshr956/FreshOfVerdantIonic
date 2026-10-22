import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth';

export const requireAccount: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated ? true : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

export const guestOnly: CanActivateFn = () => {
  const auth = inject(AuthService);
  return auth.isAuthenticated ? inject(Router).parseUrl('/home') : true;
};
