import { AesGcmUtil } from './aes-gcm.util';
import * as crypto from 'crypto';

describe('AesGcmUtil', () => {
  // Génère une clé valide de 256 bits (64 caractères hexadécimaux)
  const masterKey = crypto.randomBytes(32).toString('hex');
  const plainText = 'Top secret message 123! 🚀';

  describe('encrypt', () => {
    it('should return an encrypted payload with data, iv and tag', () => {
      const result = AesGcmUtil.encrypt(plainText, masterKey);

      expect(result).toHaveProperty('data');
      expect(result).toHaveProperty('iv');
      expect(result).toHaveProperty('tag');

      expect(result.data).not.toBe(plainText);
      // L'IV standard GCM est de 12 octets (24 caractères hex)
      expect(result.iv).toHaveLength(24);
      // Le tag standard GCM est de 16 octets (32 caractères hex)
      expect(result.tag).toHaveLength(32);
    });

    it('should produce different ciphertexts for the same input (unique IVs)', () => {
      const encrypted1 = AesGcmUtil.encrypt(plainText, masterKey);
      const encrypted2 = AesGcmUtil.encrypt(plainText, masterKey);

      expect(encrypted1.data).not.toBe(encrypted2.data);
      expect(encrypted1.iv).not.toBe(encrypted2.iv);
    });
  });

  describe('decrypt', () => {
    it('should successfully decrypt a valid payload', () => {
      const encrypted = AesGcmUtil.encrypt(plainText, masterKey);
      const decrypted = AesGcmUtil.decrypt(encrypted, masterKey);

      expect(decrypted).toBe(plainText);
    });

    it('should throw a "Decryption failed" error when using the wrong key', () => {
      const encrypted = AesGcmUtil.encrypt(plainText, masterKey);
      const wrongKey = crypto.randomBytes(32).toString('hex');

      expect(() => {
        AesGcmUtil.decrypt(encrypted, wrongKey);
      }).toThrow('Decryption failed');
    });

    it('should throw a "Decryption failed" error if the data is corrupted (GCM integrity check)', () => {
      const encrypted = AesGcmUtil.encrypt(plainText, masterKey);

      // Corruption de la donnée (on change juste un caractère)
      const corruptedData = encrypted.data.startsWith('0')
        ? '1'
        : '0' + encrypted.data.substring(1);
      const corruptedPayload = { ...encrypted, data: corruptedData };

      expect(() => {
        AesGcmUtil.decrypt(corruptedPayload, masterKey);
      }).toThrow('Decryption failed');
    });

    it('should throw an error if the tag is tampered with', () => {
      const encrypted = AesGcmUtil.encrypt(plainText, masterKey);

      // Corruption du tag
      const corruptedTag =
        encrypted.tag.substring(0, 31) + (encrypted.tag.endsWith('0') ? '1' : '0');
      const corruptedPayload = { ...encrypted, tag: corruptedTag };

      expect(() => {
        AesGcmUtil.decrypt(corruptedPayload, masterKey);
      }).toThrow('Decryption failed');
    });

    it('should handle empty string encryption/decryption', () => {
      const emptyMsg = '';
      const encrypted = AesGcmUtil.encrypt(emptyMsg, masterKey);
      const decrypted = AesGcmUtil.decrypt(encrypted, masterKey);

      expect(decrypted).toBe(emptyMsg);
    });
  });

  describe('UTF-8 and Special Characters', () => {
    it('should correctly handle multi-byte characters (emojis, accents)', () => {
      const complexMsg = 'Héllò Wòrld! 🌍 & Cryptographie';
      const encrypted = AesGcmUtil.encrypt(complexMsg, masterKey);
      const decrypted = AesGcmUtil.decrypt(encrypted, masterKey);

      expect(decrypted).toBe(complexMsg);
    });
  });
});
