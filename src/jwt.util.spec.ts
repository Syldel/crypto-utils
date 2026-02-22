import { PureJwtUtil } from './jwt.util';

describe('PureJwtUtil', () => {
  const secret = 'test-secret-key';
  const payload = { sub: '12345', name: 'John Doe' };

  it('should sign and verify a token', () => {
    const token = PureJwtUtil.sign(payload, secret);
    const verified = PureJwtUtil.verify<typeof payload>(token, secret);

    expect(verified.sub).toBe(payload.sub);
    expect(verified.name).toBe(payload.name);
  });

  it('should throw an error for an expired token', () => {
    const expiredPayload = { ...payload, exp: Math.floor(Date.now() / 1000) - 10 };
    const token = PureJwtUtil.sign(expiredPayload, secret);

    expect(() => PureJwtUtil.verify(token, secret)).toThrow('Token expired');
  });

  it('should throw an error for an invalid signature', () => {
    const token = PureJwtUtil.sign(payload, secret);
    expect(() => PureJwtUtil.verify(token, 'wrong-secret')).toThrow('Invalid signature');
  });
});
