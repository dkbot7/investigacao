/**
 * Encryption Utilities
 *
 * Funções para criptografar/descriptografar credenciais sensíveis
 * usando AES-256-GCM (Web Crypto API)
 *
 * Agent 2 - Backend Engineer
 * Data: 2025-12-08
 */

/**
 * Gera uma chave de criptografia a partir de uma master key
 *
 * @param masterKey - Master key (deve estar em env.ENCRYPTION_MASTER_KEY)
 * @returns CryptoKey para AES-256-GCM
 */
async function deriveKey(masterKey: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(masterKey),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('investigaree-serpro-salt-v1'),
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Criptografa um texto usando AES-256-GCM
 *
 * @param plaintext - Texto a ser criptografado (ex: SERPRO secret)
 * @param masterKey - Master key para derivar chave de criptografia
 * @returns String base64 no formato: {iv}:{ciphertext}:{authTag}
 */
export async function encrypt(plaintext: string, masterKey: string): Promise<string> {
  const key = await deriveKey(masterKey);
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);

  // Gerar IV aleatório (12 bytes para GCM)
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Criptografar
  const ciphertext = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    data
  );

  // Converter para base64 e retornar no formato: iv:ciphertext
  const ivBase64 = btoa(String.fromCharCode(...iv));
  const ciphertextBase64 = btoa(String.fromCharCode(...new Uint8Array(ciphertext)));

  return `${ivBase64}:${ciphertextBase64}`;
}

/**
 * Descriptografa um texto criptografado com encrypt()
 *
 * @param encrypted - String base64 no formato {iv}:{ciphertext}
 * @param masterKey - Master key para derivar chave de descriptografia
 * @returns Texto original descriptografado
 */
export async function decrypt(encrypted: string, masterKey: string): Promise<string> {
  const key = await deriveKey(masterKey);
  const [ivBase64, ciphertextBase64] = encrypted.split(':');

  if (!ivBase64 || !ciphertextBase64) {
    throw new Error('Invalid encrypted format. Expected: {iv}:{ciphertext}');
  }

  // Converter de base64 para Uint8Array
  const iv = Uint8Array.from(atob(ivBase64), (c) => c.charCodeAt(0));
  const ciphertext = Uint8Array.from(atob(ciphertextBase64), (c) => c.charCodeAt(0));

  // Descriptografar
  try {
    const plaintext = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      ciphertext
    );

    const decoder = new TextDecoder();
    return decoder.decode(plaintext);
  } catch (error) {
    throw new Error('Decryption failed. Invalid master key or corrupted data.');
  }
}

/**
 * Valida se um texto criptografado pode ser descriptografado
 * (útil para testar se master key está correta)
 */
export async function validateEncryption(
  encrypted: string,
  masterKey: string
): Promise<boolean> {
  try {
    await decrypt(encrypted, masterKey);
    return true;
  } catch {
    return false;
  }
}
