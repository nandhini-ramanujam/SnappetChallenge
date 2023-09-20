import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Auth } from 'aws-amplify';
import { canActivate } from './auth.guard';

describe('canActivate', () => {
  let mockRouter: Router;

  beforeEach(() => {
  });

  it('should allow navigation for authenticated user', async () => {
    spyOn(Auth, 'currentAuthenticatedUser').and.returnValue(Promise.resolve({}));
    const result = await canActivate(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );
    expect(result).toBe(true);
  });

  it('should prevent navigation for unauthenticated user', async () => {
    spyOn(Auth, 'currentAuthenticatedUser').and.returnValue(Promise.reject({}));
    const result = await canActivate(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );
    expect(result).toBe(false);
  });
});
