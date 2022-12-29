import { TestBed } from '@angular/core/testing';

import { GuardDashboard } from './guard.dashboard';

describe('GuardDashboard', () => {
  let guard: GuardDashboard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuardDashboard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
