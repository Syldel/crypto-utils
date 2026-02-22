import { PureJwtUtil } from './jwt.util';

describe('PureJwtUtil', () => {
  const secret = 'test-secret-key';
  const payload = { sub: '12345', name: 'John Doe' };

  describe('sign and verify', () => {
    it('should sign and verify a valid token', () => {
      const token = PureJwtUtil.sign(payload, secret);
      const verified = PureJwtUtil.verify<typeof payload>(token, secret);

      expect(verified.sub).toBe(payload.sub);
      expect(verified.name).toBe(payload.name);
    });

    it('should handle complex payloads with special characters', () => {
      const complexPayload = { role: 'admin', email: 'jöhn.döe@example.com', active: true };
      const token = PureJwtUtil.sign(complexPayload, secret);
      const verified = PureJwtUtil.verify<typeof complexPayload>(token, secret);

      expect(verified).toEqual(complexPayload);
    });
  });

  describe('security and validation', () => {
    it('should throw an error for an expired token', () => {
      // Set expiration to 10 seconds ago
      const expiredPayload = { ...payload, exp: Math.floor(Date.now() / 1000) - 10 };
      const token = PureJwtUtil.sign(expiredPayload, secret);

      expect(() => PureJwtUtil.verify(token, secret)).toThrow('Token expired');
    });

    it('should throw an error for an invalid signature', () => {
      const token = PureJwtUtil.sign(payload, secret);
      const wrongSecret = 'another-very-secret-key';

      expect(() => PureJwtUtil.verify(token, wrongSecret)).toThrow('Invalid signature');
    });

    it('should throw an error if the token structure is malformed', () => {
      const malformedToken = 'header.payload'; // Missing signature part
      expect(() => PureJwtUtil.verify(malformedToken, secret)).toThrow();
    });

    it('should throw an error if the payload has been tampered with', () => {
      const token = PureJwtUtil.sign(payload, secret);
      const [header, signature] = token.split('.');

      // Manually change the payload (e.g., change name to "Admin")
      const tamperedPayload = btoa(JSON.stringify({ ...payload, name: 'Admin' }))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

      const tamperedToken = `${header}.${tamperedPayload}.${signature}`;

      expect(() => PureJwtUtil.verify(tamperedToken, secret)).toThrow('Invalid signature');
    });
  });

  describe('edge cases', () => {
    it('should successfully verify a token that is not yet expired', () => {
      // Set expiration to 1 hour in the future
      const futurePayload = { ...payload, exp: Math.floor(Date.now() / 1000) + 3600 };
      const token = PureJwtUtil.sign(futurePayload, secret);

      const verified = PureJwtUtil.verify(token, secret);
      expect(verified).toBeDefined();
    });

    it('should throw an error for totally invalid strings', () => {
      expect(() => PureJwtUtil.verify('this-is-not-a-jwt', secret)).toThrow();
    });
  });
});
