import { UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    guard = new JwtAuthGuard();
  });

  describe('handleRequest', () => {
    it('should return the user if no error and user is valid', () => {
      const mockUser = { id: '123', username: 'julian' };
      const result = guard.handleRequest(null, mockUser);
      expect(result).toBe(mockUser);
    });

    it('should throw UnauthorizedException if error is present', () => {
      expect(() =>
        guard.handleRequest(new Error('Something went wrong'), null),
      ).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user is null', () => {
      expect(() => guard.handleRequest(null, null)).toThrow(
        UnauthorizedException,
      );
    });
  });
});
