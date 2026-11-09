import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const iAuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const IsAuth = localStorage.getItem('isAuth');
  if (IsAuth) {
    return true;
  }
  router.navigate(['/login']);
  return false;
};
