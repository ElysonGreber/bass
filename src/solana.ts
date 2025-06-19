import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface PhantomProvider {
  isPhantom?: boolean;
  connect(): Promise<{ publicKey: PublicKey }>;
  disconnect(): Promise<void>;
  on(event: string, callback: Function): void;
  publicKey?: PublicKey;
}

declare global {
  interface Window {
    solana?: PhantomProvider;
  }
}

class SolanaWallet {
  private connection: Connection;
  private provider: PhantomProvider | null = null;
  public publicKey: PublicKey | null = null;
  public isConnected = false;

  constructor() {
    this.connection = new Connection('https://api.devnet.solana.com');
  }

  async connect(): Promise<boolean> {
    try {
      if (!window.solana?.isPhantom) {
        throw new Error('Phantom wallet not found');
      }

      this.provider = window.solana;
      const response = await this.provider.connect();
      this.publicKey = response.publicKey;
      this.isConnected = true;
      
      return true;
    } catch (error) {
      console.error('Connection failed:', error);
      return false;
    }
  }

  async disconnect(): Promise<void> {
    if (this.provider) {
      await this.provider.disconnect();
    }
    this.publicKey = null;
    this.isConnected = false;
    this.provider = null;
  }

  async getBalance(): Promise<number> {
    if (!this.publicKey) return 0;
    
    try {
      const balance = await this.connection.getBalance(this.publicKey);
      return balance / LAMPORTS_PER_SOL;
    } catch (error) {
      console.error('Failed to get balance:', error);
      return 0;
    }
  }

  getAddress(): string {
    return this.publicKey?.toString() || '';
  }
}

export const solanaWallet = new SolanaWallet();