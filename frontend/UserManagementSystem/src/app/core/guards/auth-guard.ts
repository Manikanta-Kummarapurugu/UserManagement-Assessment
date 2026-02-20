import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core/primitives/di';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }
  return true;
};
