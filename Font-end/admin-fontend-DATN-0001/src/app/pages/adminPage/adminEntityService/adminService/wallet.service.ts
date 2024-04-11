import { FirebaseStorageCrudService } from './../../../../services/firebase-storage-crud.service';
import { FirebaseStorage } from '@angular/fire/storage';
// wallet.service.ts

import { Injectable } from '@angular/core';
import { Connection } from '@solana/web3.js';
// import{JsonMetadata, Metaplex, bundlrStorage, walletAdapterIdentity} from '@metaplex-foundation/js'

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  provider: any;
  constructor(
    public FirebaseStorageCrudService:FirebaseStorageCrudService
  ) {
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

  async mintItemSolanaChain(data: any) {
    // see "Detecting the Provider"
    await (window as any).solana.connect();
    const collectionAddress = 'ADT8bCj4vzCgvXa9EtDNsukmsJQAPqvFkEiwezkuo8Br';
    const symbol ='OSNFT';
    const attributes: any[] = [
      {
        trait_type:'name',
        value:data.name
      },
       {
        trait_type:'id',
        value:data.id
      },
       {
        trait_type:'au',
        value:data.id,
        type:'audio/mp3'
      },
       {
        trait_type:'id',
        value:data.id
      },
    ];
    const network = 'https://api.devnet.solana.com';
    const connection = new Connection(network, 'confirmed');
    const wallet = (window as any).solana;
    // let metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));
    // metaplex.use(
    //   bundlrStorage(
    //     {
    //       address : 'https://devnet.bundlr.network',
    //       providerUrl:'https://api.devnet.solana.com',
    //       timeout : 60000
    //     }
    //   )
    // )

    // const metadata: JsonMetadata = {
    //   name:data?.name,
    //   symbol,
    //   description: data?.description,
    //   seller_fee_basis_points: 500,
    //   image: data.image,
    //   attributes,
    //   properties: {
    //     files: [
    //       {
    //         uri: data.image,
    //         type: 'image/png',
    //       },
    //       {
    //         uri: data.audio,
    //         type: 'audio/mp3',
    //       },
    //     ],
    //     category: 'image',
    //     creators: [
    //       {
    //         address: data?.address,
    //         share: 100,
    //       },
    //     ],

    //   },
    // };
    // // const saveAsset = await this.upload({
    // //   metadata: {
    // //     path: 'metadata.json',
    // //     content: {
    // //       ...metadata
    // //     }
    // //   }
    // // });
    // const {uri} = await metaplex.nfts().uploadMetadata(metadata);
    // console.log(uri);


    // try {
    //   const mintNFTResponse = await metaplex
    //     .nfts()
    //     .create({
    //       uri: metadataURI,
    //       name: data?.name,
    //       sellerFeeBasisPoints: 500,
    //       symbol: 'WOLNFT',
    //       collection: new PublicKey(collectionAddress),
    //     })
    //     .run();

    //   // console.log(mintNFTResponse);
    //   // console.log('mintAddress', mintNFTResponse.mintAddress.toBase58());
    //   // console.log('tokenAddress', mintNFTResponse.tokenAddress.toBase58());
    //   // console.log('metadataAdress', mintNFTResponse.metadataAddress.toBase58());

    //   const block_hash = await connection.getLatestBlockhash();
    //   const slot = await connection.getSlot('confirmed');
    //   const dto = {
    //     token_address: mintNFTResponse.tokenAddress.toString(),
    //     from_address: `dead_address`,
    //     to_address: collectionAddress,
    //     hash: mintNFTResponse.response.signature,
    //     token_id: mintNFTResponse.mintAddress.toString(),
    //     block_hash: block_hash.blockhash,
    //     lastValidBlockHeight: block_hash.lastValidBlockHeight,
    //     amount: 1,
    //     is_scanned: false,
    //     confirmed: false,
    //     decimal: 0,
    //     value: '1',
    //     slot,
    //   };
    //   return dto;
    // } catch (error) {
    //   console.log(error);

    //   return error;
    // }
  }

//   async storeNFT() {
//     const test = {name : 'test'};
//     var jsonString = JSON.stringify(test);
//     // create a Blob from the JSON-string
//     // var blob = new Blob([jsonString], {type: "application/json"})
//     // const file=new File([blob],'test');
//     // const uri = await this.FirebaseStorageCrudService.uploadFile2('adminManageImage/song/', file);
//     // const metadataURI = saveAsset?.response[0]?.path;
//     // console.log(uri);
// }
}
  // async mintItemSolanaChain(data: any) {
  //   // see "Detecting the Provider"
  //   await (window as any).solana.connect();
  //   const collectionAddress = 'ADT8bCj4vzCgvXa9EtDNsukmsJQAPqvFkEiwezkuo8Br';
  //   const symbol ='OSNFT';
  //   const attributes: any[] = [
  //     {
  //       trait_type:'name',
  //       value:data.name
  //     },
  //      {
  //       trait_type:'id',
  //       value:data.id
  //     },
  //      {
  //       trait_type:'au',
  //       value:data.id,
  //       type:'audio/mp3'
  //     },
  //      {
  //       trait_type:'id',
  //       value:data.id
  //     },
  //   ];
  //   const network = 'https://api.devnet.solana.com';
  //   const connection = new Connection(network, 'confirmed');
  //   const wallet = (window as any).solana;
  //   // let metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));
  //   // metaplex.use(
  //   //   bundlrStorage(
  //   //     {
  //   //       address : 'https://devnet.bundlr.network',
  //   //       providerUrl:'https://api.devnet.solana.com',
  //   //       timeout : 60000
  //   //     }
  //   //   )
  //   // )

  //   // const metadata: JsonMetadata = {
  //   //   name:data?.name,
  //   //   symbol,
  //   //   description: data?.description,
  //   //   seller_fee_basis_points: 500,
  //   //   image: data.image,
  //   //   attributes,
  //   //   properties: {
  //   //     files: [
  //   //       {
  //   //         uri: data.image,
  //   //         type: 'image/png',
  //   //       },
  //   //       {
  //   //         uri: data.audio,
  //   //         type: 'audio/mp3',
  //   //       },
  //   //     ],
  //   //     category: 'image',
  //   //     creators: [
  //   //       {
  //   //         address: data?.address,
  //   //         share: 100,
  //   //       },
  //   //     ],

  //   //   },
  //   // };
  //   // // const saveAsset = await this.upload({
  //   // //   metadata: {
  //   // //     path: 'metadata.json',
  //   // //     content: {
  //   // //       ...metadata
  //   // //     }
  //   // //   }
  //   // // });
  //   // const {uri} = await metaplex.nfts().uploadMetadata(metadata);
  //   // console.log(uri);


  //   // try {
  //   //   const mintNFTResponse = await metaplex
  //   //     .nfts()
  //   //     .create({
  //   //       uri: metadataURI,
  //   //       name: data?.name,
  //   //       sellerFeeBasisPoints: 500,
  //   //       symbol: 'WOLNFT',
  //   //       collection: new PublicKey(collectionAddress),
  //   //     })
  //   //     .run();

  //   //   // console.log(mintNFTResponse);
  //   //   // console.log('mintAddress', mintNFTResponse.mintAddress.toBase58());
  //   //   // console.log('tokenAddress', mintNFTResponse.tokenAddress.toBase58());
  //   //   // console.log('metadataAdress', mintNFTResponse.metadataAddress.toBase58());

  //   //   const block_hash = await connection.getLatestBlockhash();
  //   //   const slot = await connection.getSlot('confirmed');
  //   //   const dto = {
  //   //     token_address: mintNFTResponse.tokenAddress.toString(),
  //   //     from_address: `dead_address`,
  //   //     to_address: collectionAddress,
  //   //     hash: mintNFTResponse.response.signature,
  //   //     token_id: mintNFTResponse.mintAddress.toString(),
  //   //     block_hash: block_hash.blockhash,
  //   //     lastValidBlockHeight: block_hash.lastValidBlockHeight,
  //   //     amount: 1,
  //   //     is_scanned: false,
  //   //     confirmed: false,
  //   //     decimal: 0,
  //   //     value: '1',
  //   //     slot,
  //   //   };
  //   //   return dto;
  //   // } catch (error) {
  //   //   console.log(error);

  //   //   return error;
  //   // }
  // }

//   async storeNFT() {
//     const test = {name : 'test'};
//     var jsonString = JSON.stringify(test);
//     // create a Blob from the JSON-string
//     // var blob = new Blob([jsonString], {type: "application/json"})
//     // const file=new File([blob],'test');
//     // const uri = await this.FirebaseStorageCrudService.uploadFile2('adminManageImage/song/', file);
//     // const metadataURI = saveAsset?.response[0]?.path;
//     // console.log(uri);
// }
// }
