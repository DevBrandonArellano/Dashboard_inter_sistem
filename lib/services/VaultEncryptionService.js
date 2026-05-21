/**
 * VaultEncryptionService para Sistema B.
 * Se encarga estrictamente de interactuar con el KMS para descifrar/cifrar.
 * Aplica el patrón Strategy.
 */
class VaultEncryptionService {
  constructor() {
    this.VAULT_ADDR = process.env.VAULT_ADDR || 'http://127.0.0.1:8200';
    this.VAULT_TOKEN = process.env.VAULT_TOKEN || '';
    this.VAULT_TRANSIT_KEY = process.env.VAULT_TRANSIT_KEY || 'sebdom-interop-key';
    this.VAULT_NAMESPACE = process.env.VAULT_NAMESPACE || 'admin';
  }

  _headers() {
    const headers = {
      'Content-Type': 'application/json',
      'X-Vault-Token': this.VAULT_TOKEN,
    };
    if (this.VAULT_NAMESPACE) {
      headers['X-Vault-Namespace'] = this.VAULT_NAMESPACE;
    }
    return headers;
  }

  async decrypt(ciphertext) {
    const url = `${this.VAULT_ADDR}/v1/transit/decrypt/${this.VAULT_TRANSIT_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify({ ciphertext }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Vault decrypt error:', response.status, errorBody);
      throw new Error(`Vault decrypt failed: ${response.status}`);
    }

    const result = await response.json();
    const decoded = Buffer.from(result.data.plaintext, 'base64').toString('utf-8');

    try {
      return JSON.parse(decoded);
    } catch {
      return decoded;
    }
  }

  async encrypt(data) {
    const plaintext = typeof data === 'string' ? data : JSON.stringify(data);
    const base64 = Buffer.from(plaintext, 'utf-8').toString('base64');
    const url = `${this.VAULT_ADDR}/v1/transit/encrypt/${this.VAULT_TRANSIT_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: this._headers(),
      body: JSON.stringify({ plaintext: base64 }),
    });

    if (!response.ok) {
      throw new Error(`Vault encrypt failed: ${response.status}`);
    }

    const result = await response.json();
    return result.data.ciphertext;
  }
}

export default new VaultEncryptionService();
