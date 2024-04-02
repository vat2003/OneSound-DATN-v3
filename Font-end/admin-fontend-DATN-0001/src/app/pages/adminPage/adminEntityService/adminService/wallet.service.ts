// wallet.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  provider: any;

  constructor() {
    this.provider = this.getProvider();
  }

  getProvider(): any {
    if ('phantom' in window && typeof window['phantom'] === 'object') {
      const phantomWindow = window as { phantom: any };
      const provider = phantomWindow.phantom?.solana;

      if (provider && provider.isPhantom) {
        return provider;
      }
    }
    window.open('https://phantom.app/', '_blank');
    return null;
  }

  async connect(): Promise<void> {
    try {
      if (!this.provider) {
        throw new Error('Provider is not available');
      }
      const resp = await this.provider.connect();
      console.log(resp.publicKey.toString());
      // Khi người dùng chấp nhận kết nối, public key sẽ được hiển thị
    } catch (err) {
      console.error(err);
      // Xử lý lỗi kết nối ở đây
    }
  }

  handleConnect(): void {
    if (!this.provider) {
      throw new Error('Provider is not available');
    }
    this.provider.on("connect", () => {
      console.log("connected!");
      // Xử lý sự kiện kết nối ở đây
    });
  }

  async disconnect(): Promise<void> {
    try {
      if (!this.provider) {
        throw new Error('Provider is not available');
      }
      await this.provider.disconnect();
    } catch (err) {
      console.error(err);
      // Xử lý lỗi ngắt kết nối ở đây
    }
  }

  isConnected(): boolean {
    return this.provider ? this.provider.isConnected : false;
  }

  handleAccountChange(): void {
    if (!this.provider) {
      throw new Error('Provider is not available');
    }
    this.provider.on("accountChanged", (publicKey: any) => {
      if (publicKey) {
        console.log(`Switched to account ${publicKey.toBase58()}`);
        // Xử lý khi người dùng chuyển đổi tài khoản ở đây
      } else {
        // Cố gắng kết nối lại nếu không nhận được public key mới
        this.connect().catch((error) => {
          console.error(error);
          // Xử lý lỗi kết nối lại ở đây
        });
      }
    });
  }
}
