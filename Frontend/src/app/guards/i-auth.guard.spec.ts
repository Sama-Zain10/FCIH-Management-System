import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { iAuthGuard } from './i-auth.guard';

describe('iAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => iAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
