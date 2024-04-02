import { WalletAdapterPhantom } from '@solana/wallet-adapter-phantom';

// src/app/services/wallet.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private walletAdapter: WalletAdapterPhantom;

  constructor() {
    this.walletAdapter = new WalletAdapterPhantom();
  }

  async connect(): Promise<void> {
    await this.walletAdapter.connect();
  }

  async disconnect(): Promise<void> {
    await this.walletAdapter.disconnect();
  }

  async getPublicKey(): Promise<string | null> {
    const publicKey = await this.walletAdapter.publicKey();
    return publicKey ? publicKey.toBase58() : null;
  }
}
