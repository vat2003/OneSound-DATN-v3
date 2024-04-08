import { HttpClient } from '@angular/common/http';
import { FirebaseStorageCrudService } from './../../../../services/firebase-storage-crud.service';
import { FirebaseStorage } from '@angular/fire/storage';
// wallet.service.ts

import { Injectable } from '@angular/core';
import { Connection, Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import base58 from "bs58";
import axios from 'axios';
// import{JsonMetadata, Metaplex, bundlrStorage, walletAdapterIdentity} from '@metaplex-foundation/js'
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToCheckedInstruction,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

import {
  MPL_TOKEN_METADATA_PROGRAM_ID,
  CreateMetadataAccountV3InstructionAccounts,
  CreateMasterEditionV3InstructionAccounts,
  createMetadataAccountV3,
  // getCreateMetadataAccountV3InstructionDataSerializer
} from "@metaplex-foundation/mpl-token-metadata";




@Injectable({
  providedIn: 'root'
})
export class WalletService {
  provider: any;
  feePayer = Keypair.fromSecretKey(
    base58.decode("5MaiiCavjCmn9Hs1o3eznqDEhRwxo7pXiAYez7keQUviUkauRiTMD8DrESdrNjN8zd9mTmVhRvBJeg5vhyvgrAhG")
  );

  connection = new Connection("https://api.devnet.solana.com");


  constructor(
    public FirebaseStorageCrudService:FirebaseStorageCrudService
  ) {
    this.provider = this.getProvider();
    // this.initializeMint();
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

//   const getAllNftsByOwner = async () => {
//     const res = await axios.post('https://api.devnet.solana.com', {
//         "jsonrpc": "2.0",
//         "id": 1,
//         "method": "getAssetsByOwner",
//         "params": {
//             "ownerAddress": "HiSpfJLbLW7H14s1NAQzCD6aM4K96nkmaiBjpNcFyjN7",
//             "page": 1,
//             "limit": 100
//         }
//     });
//     console.log(res.data);
// }
//   generateMetadataInstructionData(nftData: NftData) {
//     return this.HttpClient.post<CreateMetadataAccountV3InstructionAccounts>(
//         '/api/generate-metadata-instruction', // Replace with your backend API endpoint
//         nftData // Send the complete argument object
//     );
// }



  // async mintNFT(): Promise<void> {
  //   try {
  //     const mint = Keypair.generate();
  //     console.log(`mint: ${mint.publicKey.toBase58()}`);

  //     const ata = await getAssociatedTokenAddress(mint.publicKey, this.feePayer.publicKey);

  //     const tokenMetadataPubkey = await this.getMetadataPDA(mint.publicKey);
  //     const masterEditionPubkey = await this.getMasterEditionPDA(mint.publicKey);

  //     const tx = new Transaction().add(
  //       SystemProgram.createAccount({
  //         fromPubkey: this.feePayer.publicKey,
  //         newAccountPubkey: mint.publicKey,
  //         lamports: await getMinimumBalanceForRentExemptMint(this.connection),
  //         space: MINT_SIZE,
  //         programId: TOKEN_PROGRAM_ID,
  //       }),
  //       createInitializeMintInstruction(mint.publicKey, 0, this.feePayer.publicKey, this.feePayer.publicKey),
  //       createAssociatedTokenAccountInstruction(this.feePayer.publicKey, ata, this.feePayer.publicKey, mint.publicKey),
  //       createMintToCheckedInstruction(mint.publicKey, ata, this.feePayer.publicKey, 1, 0),
  //       getCreateMetadataAccountV3InstructionData(
  //         {
  //           metadata: tokenMetadataPubkey,
  //           mint: mint.publicKey,
  //           mintAuthority: this.feePayer.publicKey,
  //           payer: this.feePayer.publicKey,
  //           updateAuthority: this.feePayer.publicKey,
  //         },
  //         {
  //           createMetadataAccountArgsV2: {
  //             data: {
  //               name: "Fake SMS #1355",
  //               symbol: "FSMB",
  //               uri: "https://34c7ef24f4v2aejh75xhxy5z6ars4xv47gpsdrei6fiowptk2nqq.arweave.net/3wXyF1wvK6ARJ_9ue-O58CMuXrz5nyHEiPFQ6z5q02E",
  //               sellerFeeBasisPoints: 100,
  //               creators: [
  //                 {
  //                   address: this.feePayer.publicKey,
  //                   verified: true,
  //                   share: 100,
  //                 },
  //               ],
  //               collection: null,
  //               uses: null,
  //             },
  //             isMutable: true,
  //           },
  //         }
  //       ),
  //       createCreateMasterEditionV3Instruction(
  //         {
  //           edition: masterEditionPubkey,
  //           mint: mint.publicKey,
  //           updateAuthority: this.feePayer.publicKey,
  //           mintAuthority: this.feePayer.publicKey,
  //           payer: this.feePayer.publicKey,
  //           metadata: tokenMetadataPubkey,
  //         },
  //         {
  //           createMasterEditionArgs: {
  //             maxSupply: 0,
  //           },
  //         }
  //       )
  //     );

  //     console.log(await this.connection.sendTransaction(tx, [this.feePayer, mint]));
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // async getMetadataPDA(mint: PublicKey): Promise<PublicKey> {
  //   const [publicKey] = await PublicKey.findProgramAddress(
  //     [Buffer.from("metadata"), MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
  //     MPL_TOKEN_METADATA_PROGRAM_ID
  //   );
  //   return publicKey;
  // }

  // async getMasterEditionPDA(mint: PublicKey): Promise<PublicKey> {
  //   const [publicKey] = await PublicKey.findProgramAddress(
  //     [Buffer.from("metadata"), MPL_TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer(), Buffer.from("edition")],
  //     MPL_TOKEN_METADATA_PROGRAM_ID
  //   );
  //   return publicKey;
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
