import { AesGcmUtil } from './aes-gcm.util';
import * as crypto from 'crypto';

describe('AesGcmUtil', () => {
  const masterKey = crypto.randomBytes(32).toString('hex');
  const clearText = 'Message secret 123';

  it('should encrypt and decrypt correctly', () => {
    const encrypted = AesGcmUtil.encrypt(clearText, masterKey);

    expect(encrypted.data).toBeDefined();
    expect(encrypted.iv).toBeDefined();
    expect(encrypted.tag).toBeDefined();

    const decrypted = AesGcmUtil.decrypt(encrypted, masterKey);
    expect(decrypted).toBe(clearText);
  });

  it('should throw an error with an invalid key length', () => {
    const shortKey = '1234';
    expect(() => AesGcmUtil.encrypt(clearText, shortKey)).toThrow();
  });
});
