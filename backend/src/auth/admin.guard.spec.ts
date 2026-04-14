import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AdminGuard } from './admin.guard';

describe('AdminGuard', () => {
  let guard: AdminGuard;

  beforeEach(() => {
    guard = new AdminGuard();
  });

  function mockContext(user: any): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    } as any;
  }

  it('should allow admin users', () => {
    const ctx = mockContext({ id: 1, role: 'admin' });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('should deny non-admin users', () => {
    const ctx = mockContext({ id: 2, role: 'customer' });
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });

  it('should deny when no user is present', () => {
    const ctx = mockContext(null);
    expect(() => guard.canActivate(ctx)).toThrow(ForbiddenException);
  });
});
