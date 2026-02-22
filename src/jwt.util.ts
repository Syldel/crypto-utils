import CryptoJS from 'crypto-js';
import { EncodingHelper } from './encoding.helper';

export class PureJwtUtil {
  static sign(payload: Record<string, any>, secret: string): string {
    const header = { alg: 'HS256', typ: 'JWT' };

    const encodedHeader = EncodingHelper.objToBase64Url(header);
    const encodedPayload = EncodingHelper.objToBase64Url(payload);

    const signature = CryptoJS.HmacSHA256(`${encodedHeader}.${encodedPayload}`, secret);

    // Conversion du WordArray CryptoJS en Base64URL
    const encodedSignature = EncodingHelper.toBase64Url(signature.toString(CryptoJS.enc.Base64));

    return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
  }

  static verify<T extends object>(token: string, secret: string): T {
    const [headerB64, payloadB64, signatureB64] = token.split('.');
    if (!signatureB64) throw new Error('Invalid token format');

    const expectedSignature = EncodingHelper.toBase64Url(
      CryptoJS.HmacSHA256(`${headerB64}.${payloadB64}`, secret).toString(CryptoJS.enc.Base64),
    );

    if (signatureB64 !== expectedSignature) {
      throw new Error('Invalid signature');
    }

    const payload = JSON.parse(
      EncodingHelper.fromBase64(
        payloadB64.replace(/-/g, '+').replace(/_/g, '/'), // Re-conversion URL -> Standard Base64
      ),
    ) as T;

    if ((payload as any).exp && Date.now() >= (payload as any).exp * 1000) {
      throw new Error('Token expired');
    }

    return payload;
  }
}
