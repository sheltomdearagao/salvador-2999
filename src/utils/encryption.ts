
// Utility for encrypting/decrypting sensitive data in localStorage
const ENCRYPTION_KEY = 'salvador2999_encrypt_key';
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 horas em milliseconds

interface EncryptedData {
  data: string;
  timestamp: number;
  hash: string;
}

// Função simples de criptografia (XOR cipher)
function encrypt(text: string, key: string): string {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(
      text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    );
  }
  return btoa(result);
}

function decrypt(encryptedText: string, key: string): string {
  try {
    const decoded = atob(encryptedText);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      result += String.fromCharCode(
        decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      );
    }
    return result;
  } catch {
    return '';
  }
}

// Gerar hash simples para verificação de integridade
function generateHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Converter para 32bit integer
  }
  return Math.abs(hash).toString(16);
}

export function secureStore(key: string, value: string): void {
  try {
    const timestamp = Date.now();
    const encryptedData = encrypt(value, ENCRYPTION_KEY);
    const hash = generateHash(value + timestamp);
    
    const dataToStore: EncryptedData = {
      data: encryptedData,
      timestamp,
      hash
    };
    
    localStorage.setItem(key, JSON.stringify(dataToStore));
  } catch (error) {
    console.error('Erro ao armazenar dados de forma segura:', error);
  }
}

export function secureRetrieve(key: string): string | null {
  try {
    const storedData = localStorage.getItem(key);
    if (!storedData) return null;
    
    const parsed: EncryptedData = JSON.parse(storedData);
    const now = Date.now();
    
    // Verificar se os dados expiraram
    if (now - parsed.timestamp > SESSION_TIMEOUT) {
      localStorage.removeItem(key);
      return null;
    }
    
    const decryptedData = decrypt(parsed.data, ENCRYPTION_KEY);
    
    // Verificar integridade
    const expectedHash = generateHash(decryptedData + parsed.timestamp);
    if (expectedHash !== parsed.hash) {
      console.warn('Dados podem ter sido comprometidos');
      localStorage.removeItem(key);
      return null;
    }
    
    return decryptedData;
  } catch (error) {
    console.error('Erro ao recuperar dados seguros:', error);
    return null;
  }
}

export function secureClear(key: string): void {
  localStorage.removeItem(key);
}

export function isSessionExpired(key: string): boolean {
  try {
    const storedData = localStorage.getItem(key);
    if (!storedData) return true;
    
    const parsed: EncryptedData = JSON.parse(storedData);
    const now = Date.now();
    
    return now - parsed.timestamp > SESSION_TIMEOUT;
  } catch {
    return true;
  }
}
