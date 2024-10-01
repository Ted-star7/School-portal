import { TestBed } from '@angular/core/testing'; 
import { CanActivateFn } from '@angular/router';
import { AuthGuard } from './auth.guard';  // Import the AuthGuard class
import { SessionService } from '../Services/session.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard, SessionService],  // Provide any required dependencies
    });

    guard = TestBed.inject(AuthGuard);  // Get the instance of AuthGuard
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
