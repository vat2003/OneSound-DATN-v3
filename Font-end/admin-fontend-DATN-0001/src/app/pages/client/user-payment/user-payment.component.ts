import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../adminPage/adminEntityService/adminService/wallet.service';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js'; // Import Solana Web3.js library
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-payment',
  standalone:true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './user-payment.component.html',
  styleUrls: ['./user-payment.component.scss']
})
export class UserPaymentComponent implements OnInit {
  title = 'ng-connect-solana-wallet';

  public walletConnected = false;
  public walletId = '';
  public balanceSOL: any;
  balance:any;

  constructor(private walletService: WalletService) {}

  async connectToWallet() {
    try {
      const provider = this.getProvider();
      if (provider) {
        await provider.connect();
        this.walletConnected = true;
        this.walletId = provider.publicKey.toString();
        const balance = await provider.getBalance(provider.publicKey);
        this.balanceSOL = balance.toString(); // Chuyển đổi balance thành chuỗi
        console.log("Số tiền: ", this.balanceSOL);
        // console.log("Số tiền: ", SOL);
      } else {
        console.error('Provider is not available');
      }
    } catch (error) {
      console.error('Error connecting to Solana wallet:', error);
    }
  }


  async getBalance(walletAddress: string) {
    debugger
    try {
       debugger
      const connection = new Connection(clusterApiUrl('mainnet-beta'));
      const balance = await connection.getBalance(new PublicKey(walletAddress));
      this.balanceSOL = (balance / 10 ** 9).toFixed(2); // Convert balance from lamports to SOL
      // alert("Lên button get Balance")
    } catch (error) {
      // alert("Error getting wallet balance: "+error)
      console.error('Error getting wallet balance:', error);
    }
  }

  async checkWalletConnected() {
    try {
      const isConnected = await this.walletService.isConnected();
      if (isConnected) {
        this.walletConnected = true;
        const provider = this.walletService.getProvider();
        if (provider && provider.publicKey) {
          this.walletId = provider.publicKey.toString();
          console.log("ID: ",this.walletId)
          await this.getBalance(this.walletId);
        } else {
          console.error('Provider or publicKey is null or undefined');
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  }

  private getProvider = () => {
    if (WalletExtension.PHANTOM in window) {
      const provider = (window as any).phantom?.solana;

      if (provider?.isPhantom) {
        return provider;
      }
    }
    alert("Please install phantom extension for this request!");
  };



  ngOnInit(): void {
    this.checkWalletConnected();
    // alert("Hehe")
  }
}
export enum WalletExtension {
  PHANTOM = 'phantom',
  METAMASK = 'metamask',
  ARCANA = 'arcana',
  GATE = 'gate'
}
