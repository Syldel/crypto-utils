import * as crypto from 'crypto';

export interface EncryptedData {
  data: string;
  iv: string;
  tag: string;
}

export class AesGcmUtil {
  private static validateKey(key: Buffer | string): Buffer {
    const encryptionKey = typeof key === 'string' ? Buffer.from(key, 'hex') : key;
    if (encryptionKey.length !== 32) {
      throw new Error('Invalid Key: Key must be 32 bytes (64 hex characters)');
    }
    return encryptionKey;
  }
  static encrypt(text: string, key: Buffer | string): EncryptedData {
    const encryptionKey = this.validateKey(key);
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', encryptionKey, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return {
      data: encrypted,
      iv: iv.toString('hex'),
      tag: cipher.getAuthTag().toString('hex'),
    };
  }

  static decrypt(payload: EncryptedData, key: Buffer | string): string {
    const encryptionKey = this.validateKey(key);
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      encryptionKey,
      Buffer.from(payload.iv, 'hex'),
    );

    decipher.setAuthTag(Buffer.from(payload.tag, 'hex'));

    let decrypted = decipher.update(payload.data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}
