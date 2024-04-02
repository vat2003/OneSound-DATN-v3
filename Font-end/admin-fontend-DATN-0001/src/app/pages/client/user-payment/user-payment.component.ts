import { Component } from '@angular/core';
import { WalletService } from '../../adminPage/adminEntityService/adminService/wallet.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as web3 from '@solana/web3.js'; // Import Solana Web3.js library

@Component({
  selector: 'app-user-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-payment.component.html',
  styleUrl: './user-payment.component.scss'
})
export class UserPaymentComponent {
  title = 'ng-connect-solana-wallet'; // Change the title

  public walletConnected: boolean = false;
  public walletId: string = '';
  public balanceSOL: string = '0.00'; // Change the balance variable name

  constructor(private walletService: WalletService) {}

  connectToWallet = async () => {
    try {
      await this.walletService.connectWallet(); // Connect to Solana wallet
      this.walletConnected = true; // Update wallet connected status
      this.walletId = this.walletService.publicKey.toBase58(); // Get wallet public key
      await this.getBalance(this.walletId); // Get wallet balance
    } catch (error) {
      console.error('Error connecting to Solana wallet:', error);
    }
  }

  getBalance = async (walletAddress: string) => {
    try {
      const connection = new web3.Connection(web3.clusterApiUrl('mainnet-beta')); // Connect to Solana mainnet
      const balance = await connection.getBalance(new web3.PublicKey(walletAddress)); // Get wallet balance
      this.balanceSOL = (balance / web3.LAMPORTS_PER_SOL).toFixed(2); // Convert balance from lamports to SOL
    } catch (error) {
      console.error('Error getting wallet balance:', error);
    }
  }

  checkWalletConnected = async () => {
    try {
      const isConnected = await this.walletService.checkWalletConnected(); // Check if wallet is connected
      if (isConnected) {
        this.walletConnected = true; // Update wallet connected status
        this.walletId = this.walletService.publicKey.toBase58(); // Get wallet public key
        await this.getBalance(this.walletId); // Get wallet balance
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  }

  ngOnInit(): void {
    this.checkWalletConnected(); // Check if wallet is connected on component initialization
  }
}
