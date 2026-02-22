import * as crypto from 'crypto';

export class PureJwtUtil {
  static verify<T extends object>(token: string, secret: string): T {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token format');

    const [headerB64, payloadB64, signatureB64] = parts;
    const dataToVerify = `${headerB64}.${payloadB64}`;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(dataToVerify)
      .digest('base64url');

    if (signatureB64 !== expectedSignature) {
      throw new Error('Invalid signature');
    }

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8')) as T;
    const payloadRecord = payload as Record<string, unknown>;

    if (typeof payloadRecord.exp === 'number') {
      if (Date.now() >= payloadRecord.exp * 1000) {
        throw new Error('Token expired');
      }
    }

    return payload;
  }

  static sign(payload: Record<string, any>, secret: string): string {
    const header = { alg: 'HS256', typ: 'JWT' };

    const encode = (obj: any) => Buffer.from(JSON.stringify(obj)).toString('base64url');

    const encodedHeader = encode(header);
    const encodedPayload = encode(payload);

    const signature = crypto
      .createHmac('sha256', secret)
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }
}
