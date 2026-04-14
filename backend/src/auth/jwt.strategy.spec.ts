import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    strategy = new JwtStrategy();
  });

  it('should extract user from JWT payload', () => {
    const payload = { sub: 1, email: 'test@test.com', role: 'customer' };
    const result = strategy.validate(payload);

    expect(result).toEqual({ id: 1, email: 'test@test.com', role: 'customer' });
  });

  it('should map sub to id', () => {
    const payload = { sub: 42, email: 'admin@test.com', role: 'admin' };
    const result = strategy.validate(payload);

    expect(result.id).toBe(42);
    expect(result.role).toBe('admin');
  });
});
