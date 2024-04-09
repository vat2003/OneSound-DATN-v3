// import { Component } from '@angular/core';
// import { WalletService } from '../../adminPage/adminEntityService/adminService/wallet.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import Web3 from 'web3';

// @Component({
//   selector: 'app-user-payment',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './user-payment.component.html',
//   styleUrl: './user-payment.component.scss'
// })
// export class UserPaymentComponent {
//   title = 'ng-connect-ethereum-wallet';

//   public walletConnected: boolean = false;
//   public walletId: string = '';
//   public balanceETH : string = '0.00';
//   web3 :any= null;

//   constructor(private walletService: WalletService){
//     this.web3 = new Web3((window as any).ethereum);
//   }

//   connectToWallet  = async () => {
//    const address = await this.walletService.connectWallet();
//    console.log(address);
//   //  await this.walletService.checkWalletConnected();
//   this.walletConnected = true;
//   this.walletId = address;

//   //get balance
//   await this.getBalance(this.walletId);
//   }

//   getBalance = async (walletAddress:string) => {
//     const b = await this.web3.eth.getBalance(walletAddress);
//     this.balanceETH = (Number(b)/1e18).toFixed(2);
//     console.log(this.balanceETH);

//   }

//   checkWalletConnected = async () => {
//     const accounts = await this.walletService.checkWalletConnected();
//     if(accounts.length > 0){
//       this.walletConnected = true;
//       this.walletId = accounts[0];
//       console.log("IDDD: ",this.walletId)
//     // await this.getBalance(this.walletId);

//     }
//   }

//   ngOnInit(): void {
//     this.checkWalletConnected();
//   }
// }
export class UserPaymentComponent {}