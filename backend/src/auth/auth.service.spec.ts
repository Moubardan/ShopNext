import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<Record<keyof UsersService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };
    jwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should create a user and return a token', async () => {
      usersService.findByEmail!.mockResolvedValue(null);
      usersService.create!.mockResolvedValue({
        id: 1, email: 'test@test.com', name: 'Test', role: 'customer',
      });

      const result = await service.register({
        name: 'Test', email: 'test@test.com', password: 'password123',
      });

      expect(result.access_token).toBe('mock-jwt-token');
      expect(result.user.email).toBe('test@test.com');
      expect(usersService.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email exists', async () => {
      usersService.findByEmail!.mockResolvedValue({ id: 1, email: 'test@test.com' });

      await expect(
        service.register({ name: 'Test', email: 'test@test.com', password: 'pass' }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return token for valid credentials', async () => {
      const hash = await bcrypt.hash('password123', 10);
      usersService.findByEmail!.mockResolvedValue({
        id: 1, email: 'test@test.com', password: hash, name: 'Test', role: 'customer',
      });

      const result = await service.login({ email: 'test@test.com', password: 'password123' });

      expect(result.access_token).toBe('mock-jwt-token');
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      const hash = await bcrypt.hash('password123', 10);
      usersService.findByEmail!.mockResolvedValue({
        id: 1, email: 'test@test.com', password: hash, role: 'customer',
      });

      await expect(
        service.login({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for unknown email', async () => {
      usersService.findByEmail!.mockResolvedValue(null);

      await expect(
        service.login({ email: 'nobody@test.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('googleLogin', () => {
    it('should create a new user if not found', async () => {
      usersService.findByEmail!.mockResolvedValue(null);
      usersService.create!.mockResolvedValue({
        id: 2, email: 'google@test.com', name: 'Google User', role: 'customer',
      });

      const result = await service.googleLogin({ email: 'google@test.com', name: 'Google User' });

      expect(result.access_token).toBe('mock-jwt-token');
      expect(usersService.create).toHaveBeenCalled();
    });
  });
});
