# @syldel/crypto-utils

A robust, high-performance cryptographic toolkit for Node.js and NestJS applications. This package prioritizes security by leveraging Node's native crypto module (OpenSSL) for maximum protection of sensitive data and private keys.

## 🚀 Key Features
- **Native Security**: Built on top of Node.js crypto (OpenSSL) for hardware-accelerated encryption.

- **AES-256-GCM**: Industry-standard authenticated encryption (AEAD) to ensure both confidentiality and data integrity.

- **Lightweight JWT**: Pure implementation for signing and verifying tokens without heavy dependencies.

- **Standardized Error Handling**: Harmonized error messages ("Decryption failed") for better security and predictable testing.

## 🛠 Usage

### AES-256-GCM (Authenticated Encryption)
Designed for high-security environments. It automatically handles Initialization Vectors (IV) and Authentication Tags.

```ts
import { AesGcmUtil } from '@syldel/crypto-utils';

const keyHex = "0123456789abcdef..."; // 64 hex characters (32 bytes)
const message = "Sensitive data";

// Encrypt
const encrypted = AesGcmUtil.encrypt(message, keyHex);
// Returns: { data: '...', iv: '...', tag: '...' }

// Decrypt
try {
  const original = AesGcmUtil.decrypt(encrypted, keyHex);
} catch (error) {
  // Throws "Decryption failed" if data is tampered or key is wrong
}
```

### Pure JWT Utilities
A lightweight way to handle JWTs in your NestJS guards or services.

```ts
import { PureJwtUtil } from '@syldel/crypto-utils';

const secret = "your-secure-secret";
const payload = { sub: "user_123", role: "admin" };

// Sign a token
const token = PureJwtUtil.sign(payload, secret);

// Verify and decode
try {
  const decoded = PureJwtUtil.verify<MyUserType>(token, secret);
} catch (err) {
  // Handles "Token expired" or "Invalid signature"
}
```

## 🔒 Security & Performance

- **Zero External Crypto Libs**: By using native Node.js APIs, this package minimizes the attack surface and dependency supply chain risks.

- **Side-Channel Protection**: Leverages OpenSSL's C++ implementation to protect against timing attacks.

- **GCM Integrity**: Unlike AES-CTR or CBC, AES-GCM ensures that any single-bit modification to the encrypted data will be detected during decryption.


## 🧪 Testing

Full test suite with 100% coverage on core crypto logic.

```bash
npm run test
```

## 👨‍💻 Développement

### Installation des dépendances
```bash
npm install
```

### Compilation
Génère le dossier `dist/` contenant les fichiers JavaScript et les déclarations de types (`.d.ts`).
```bash
npm run build
```

### Qualité du code
Le projet utilise **ESLint** pour la logique et **Prettier** pour le formatage.
```bash
# Vérifier les erreurs
npx eslint .
```

## 🔗 Utilisation en local (Development Workflow)

Pour utiliser ce package dans tes autres projets sans le publier sur NPM :

1.  Dans le dossier `crypto-utils` :
    ```bash
    npm link
    ```
2.  Dans ton projet (ex: `my-nest-project`) :
    ```bash
    npm link @syldel/crypto-utils
    ```

## 📦 Publication

Le projet utilise des **Granular Access Tokens** pour la publication afin de contourner la double authentification (2FA) manuelle tout en maintenant une sécurité maximale.

### Configuration du Token
1. Générer un token sur NPM avec les permissions `Read and Write`.
2. Restreindre l'accès au package `@syldel/crypto-utils` uniquement.
3. Utiliser l'option `Bypass 2FA` pour permettre l'automatisation.

### Commande de publication rapide
Si tu n'utilises pas de fichier `.npmrc`, tu peux publier en passant le token directement :
```bash
npm publish --access public --//registry.npmjs.org/:_authToken=TON_TOKEN_ICI
```

### Configuration de la publication
Créez un fichier .npmrc à la racine (ignoré par Git) pour l'authentification :

```
//registry.npmjs.org/:_authToken=npm_votre_token_ici
```

### Publier une nouvelle version
La commande suivante automatise le build, l'incrémentation de version et l'envoi vers NPM :

```bash
npm run release
```

### Pousse le commit ET le tag sur GitHub
```bash
git push origin main --follow-tags
```
