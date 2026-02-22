import forge from 'node-forge';

export interface EncryptedData {
  data: string;
  iv: string;
  tag: string;
}

export class AesGcmUtil {
  static encrypt(text: string, keyHex: string): EncryptedData {
    const key = forge.util.hexToBytes(keyHex);
    const iv = forge.random.getBytesSync(12); // IV standard GCM = 12 octets

    const cipher = forge.cipher.createCipher('AES-GCM', key);
    cipher.start({ iv: iv });
    cipher.update(forge.util.createBuffer(forge.util.encodeUtf8(text)));
    cipher.finish();

    return {
      data: forge.util.bytesToHex(cipher.output.getBytes()),
      iv: forge.util.bytesToHex(iv),
      tag: forge.util.bytesToHex(cipher.mode.tag.getBytes()),
    };
  }

  static decrypt(payload: EncryptedData, keyHex: string): string {
    const key = forge.util.hexToBytes(keyHex);
    const iv = forge.util.hexToBytes(payload.iv);
    const tag = forge.util.hexToBytes(payload.tag);
    const ciphertext = forge.util.hexToBytes(payload.data);

    const decipher = forge.cipher.createDecipher('AES-GCM', key);
    decipher.start({
      iv: iv,
      tag: forge.util.createBuffer(tag),
    });
    decipher.update(forge.util.createBuffer(ciphertext));

    // finish() renvoie 'false' si le tag est invalide (données corrompues ou mauvaise clé)
    const authenticated = decipher.finish();
    if (!authenticated) {
      throw new Error('Decryption failed: authentication failed (bad key or corrupted data)');
    }

    return forge.util.decodeUtf8(decipher.output.getBytes());
  }
}
