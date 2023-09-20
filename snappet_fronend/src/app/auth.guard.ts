import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { Auth } from 'aws-amplify';

export const canActivate: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  try {
    await Auth.currentAuthenticatedUser();
    return true;
  } catch (error) {
    return false;
  }
};