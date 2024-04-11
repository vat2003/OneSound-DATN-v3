import {
    
    bundlrStorage,
    JsonMetadata,
    keypairIdentity,
    Metaplex,
    toMetaplexFile,
    UploadMetadataInput,
  } from "@metaplex-foundation/js";
  import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
  const bs58 = require("bs58");
  const fs = require("fs");
  
  const endpoint = 'https://api.devnet.solana.com';
  const connection = new Connection(endpoint, "confirmed");
  const keypair = Keypair.fromSecretKey(
    bs58.decode('4YUkyUf1MeU2qrn8XFqgT6XvwyKB8jEbjWMGqgDnteE7pRDJKDmDLjiLqjVgrXRb2793Z4wgUV8uZQpPGEWes3fD') // secret key của ví phatom
  );
  //create metaplex instance on devnet using this wallet
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(keypair))

    metaplex.use(
        bundlrStorage({
          address: 'https://devnet.bundlr.network',
          providerUrl: endpoint,
          timeout: 60000,
        }))
  
  
  async function uploadImage(
    filePath: string,
    fileName: string
  ): Promise<string> {
    console.log(`--- Upload image ---`);
    const imgBuffer = fs.readFileSync(filePath + fileName);
    const imgMetaplexFile = toMetaplexFile(imgBuffer, fileName);
    const imgUri = await metaplex.storage().upload(imgMetaplexFile);
    console.log(`Image URI : ${imgUri}`);
    return imgUri;
  }
  
  /**
   *
   * @param wallet Solana Keypair
   * @param tokenMetadata Metaplex Fungible Token Standard object
   * @returns
   */
  const uploadMetadata = async (
    tokenMetadata: any
  ): Promise<string> => {
    //Upload to Arweave
    const { uri } = await metaplex.nfts().uploadMetadata(tokenMetadata);
    console.log(`Arweave URL: `, uri);
    return uri;
  };
  
//   const mintNFT = async () => {

//     const uri = 'https://raw.githubusercontent.com/vat2003/OneSound-DATN-v3/main/metadata.json';
  
//     const mintNFTResponse = await metaplex.nfts().create({
//       uri,
//       name: 'OneSoundNFT',
//       sellerFeeBasisPoints: 500,
//       symbol: 'OSNFT',
//       isCollection: true,
//       collectionIsSized: true,
//     });
  
//     console.log(mintNFTResponse);
//     console.log("mintAddress", mintNFTResponse.mintAddress.toBase58());
//     console.log("tokenAddress", mintNFTResponse.tokenAddress.toBase58());
//     console.log("metadataAdress", mintNFTResponse.metadataAddress.toBase58());
//     const collectionInfo = {
//       mintAddress: mintNFTResponse.mintAddress.toBase58(),
//       tokenAddress: mintNFTResponse.tokenAddress.toBase58(),
//       metadataAddress: mintNFTResponse.metadataAddress.toBase58()
//     }
//     console.log(collectionInfo);
//   };
  
//   // mintNFT();
//   // Deploy collection
  const runCommand = async () => {
    // await mintNFT();
    const data = [
        {
            "id": 6,
            "name": "2h ",
            "image": "https://firebasestorage.googleapis.com/v0/b/angular-firebase-demo-10001.appspot.com/o/adminManageImage%2Fsong%2F2h.jpg?alt=media&token=d3e58cfe-2bea-4e30-9d52-e4dd2457eb1f",
            "path": "https://firebasestorage.googleapis.com/v0/b/angular-firebase-demo-10001.appspot.com/o/adminManageAudio%2Fsong%2FMCK_-_2h_320kbps.mp3?alt=media&token=3ccbc7c1-5bdb-4a3d-b89c-f777d0f30741",
            "lyrics": null,
            "active": true,
            "album": null,
            "release": 1044464400000
        },
        {
            "id": 7,
            "name": "Hit me up",
            "image": "https://firebasestorage.googleapis.com/v0/b/angular-firebase-demo-10001.appspot.com/o/adminManageImage%2Fsong%2FHitmeup.jpg?alt=media&token=7029aa91-ca3a-4147-b3e2-1f9b01f39acc",
            "path": "https://firebasestorage.googleapis.com/v0/b/angular-firebase-demo-10001.appspot.com/o/adminManageAudio%2Fsong%2FBINZ%20-%20HIT%20ME%20UP%20ft%20NOMOVODKA_320kbps.mp3?alt=media&token=4c468d4c-78c9-42ef-8143-495bb6ca71b7",
            "lyrics": null,
            "active": true,
            "album": null,
            "release": 1697648400000
        },
        {
            "id": 8,
            "name": "OK",
            "image": "https://firebasestorage.googleapis.com/v0/b/angular-firebase-demo-10001.appspot.com/o/adminManageImage%2Fsong%2FOK.jpg?alt=media&token=e58b0f1f-6fa4-4c93-adaa-aee0975a680c",
            "path": "https://firebasestorage.googleapis.com/v0/b/angular-firebase-demo-10001.appspot.com/o/adminManageAudio%2Fsong%2FBINZ%20-%20OK_320kbps.mp3?alt=media&token=c8d3572d-9907-4587-8882-7a3306d0bebc",
            "lyrics": null,
            "active": true,
            "album": null,
            "release": 1577811600000
        },
        {
            "id": 9,
            "name": "Winter blossom",
            "image": "https://firebasestorage.googleapis.com/v0/b/angular-firebase-demo-10001.appspot.com/o/adminManageImage%2Fsong%2FWinter_blossom.jpg?alt=media&token=2569d6d0-138d-48e9-b924-b88fadec01f3",
            "path": "https://firebasestorage.googleapis.com/v0/b/angular-firebase-demo-10001.appspot.com/o/adminManageAudio%2Fsong%2FDept_ft_Ashley_Alisha_-_Winter_blossom_320kbps.mp3?alt=media&token=15e6bb64-df63-4d80-8544-13bdc9f59608",
            "lyrics": null,
            "active": true,
            "album": null,
            "release": 1613062800000
        },
        {
            "id": 10,
            "name": "Been through",
            "image": "https://firebasestorage.googleapis.com/v0/b/angular-firebase-demo-10001.appspot.com/o/adminManageImage%2Fsong%2Fbeenthrough.jpg?alt=media&token=6069092e-6a1c-4502-9351-d355eb10db9e",
            "path": "https://firebasestorage.googleapis.com/v0/b/angular-firebase-demo-10001.appspot.com/o/adminManageAudio%2Fsong%2FEXO_-_Been_through_320kbps.mp3?alt=media&token=7b2ba590-18af-4c0b-828a-84e1afb77ec8",
            "lyrics": null,
            "active": true,
            "album": null,
            "release": 1514221200000
        },
        {
            "id": 11,
            "name": "Paper cuts",
            "image": "https://firebasestorage.googleapis.com/v0/b/angular-firebase-demo-10001.appspot.com/o/adminManageImage%2Fsong%2Fbeenthrough.jpg?alt=media&token=6069092e-6a1c-4502-9351-d355eb10db9e",
            "path": "https://firebasestorage.googleapis.com/v0/b/angular-firebase-demo-10001.appspot.com/o/adminManageAudio%2Fsong%2FEXO_-_Paper_cuts_320kbps.mp3?alt=media&token=2f6c5489-e542-4fae-8d3d-5bdb42e95475",
            "lyrics": null,
            "active": true,
            "album": null,
            "release": 1554915600000
        },
        {
            "id": 12,
            "name": "pho real",
            "image": "https://firebasestorage.googleapis.com/v0/b/angular-firebase-demo-10001.appspot.com/o/adminManageImage%2Fsong%2Fpho_real.jpg?alt=media&token=d24ec63d-3ac7-4f64-a522-6b9bc4205458",
            "path": "https://firebasestorage.googleapis.com/v0/b/angular-firebase-demo-10001.appspot.com/o/adminManageAudio%2Fsong%2Fbbno_Low_G__Anh_Phan_-_pho_real_320kbps_2.mp3?alt=media&token=33e7b1d3-1f62-495f-a243-fc89cf16826e",
            "lyrics": null,
            "active": true,
            "album": null,
            "release": 1709053200000
        },
        {
            "id": 13,
            "name": "Mind Games",
            "image": "https://firebasestorage.googleapis.com/v0/b/angular-firebase-demo-10001.appspot.com/o/adminManageImage%2Fsong%2FMindgames.jpg?alt=media&token=f7688ba1-6d0f-41ea-bf58-3c265aec4734",
            "path": "https://firebasestorage.googleapis.com/v0/b/angular-firebase-demo-10001.appspot.com/o/adminManageAudio%2Fsong%2FSickick_-_Mind_Games_320kbps.mp3?alt=media&token=ac39bcf0-60a0-4925-9308-df009fde3243",
            "lyrics": null,
            "active": true,
            "album": null,
            "release": 1520614800000
        },
        {
            "id": 14,
            "name": "Simple Love ",
            "image": "https://firebasestorage.googleapis.com/v0/b/angular-firebase-demo-10001.appspot.com/o/adminManageImage%2Fsong%2FSimple_love.jpg?alt=media&token=0271206f-cc26-461c-aa68-a6163573c605",
            "path": "https://firebasestorage.googleapis.com/v0/b/angular-firebase-demo-10001.appspot.com/o/adminManageAudio%2Fsong%2FObito_x_Seachains_x_Davis_x_Lena_-_Simple_Love_320kbps.mp3?alt=media&token=2e6021e5-6ffe-4ac9-ae20-c50e375fa1f9",
            "lyrics": null,
            "active": true,
            "album": null,
            "release": 1571331600000
        },
        {
            "id": 15,
            "name": "Hurts_So_Good",
            "image": "https://firebasestorage.googleapis.com/v0/b/angular-firebase-demo-10001.appspot.com/o/adminManageImage%2Fsong%2FHurtsogood.jpg?alt=media&token=23635919-4334-4832-aee5-8f46163d5914",
            "path": "https://firebasestorage.googleapis.com/v0/b/angular-firebase-demo-10001.appspot.com/o/adminManageAudio%2Fsong%2FAstrict_-_Hurts_So_Good_320kbps_2.mp3?alt=media&token=e241ec1b-bd72-404e-b2c9-ead07aff4497",
            "lyrics": null,
            "active": true,
            "album": null,
            "release": 1462467600000
        },
        {
            "id": 16,
            "name": "WDYS",
            "image": "https://firebasestorage.googleapis.com/v0/b/angular-firebase-demo-10001.appspot.com/o/adminManageImage%2Fsong%2FWDYS.jpg?alt=media&token=1bce653b-a42b-4c25-8161-9333abf1e2af",
            "path": "https://firebasestorage.googleapis.com/v0/b/angular-firebase-demo-10001.appspot.com/o/adminManageAudio%2Fsong%2FYedira_ft_Asheu_-_WDYS_320kbps_2.mp3?alt=media&token=4fdd8f14-4e61-450f-a925-d83658fdd619",
            "lyrics": null,
            "active": true,
            "album": null,
            "release": 1700672400000
        },
        {
            "id": 17,
            "name": "Creepin",
            "image": "https://firebasestorage.googleapis.com/v0/b/angular-firebase-demo-10001.appspot.com/o/adminManageImage%2Fsong%2Fcreepin.jpg?alt=media&token=645d5c89-c7c7-40c3-9471-70b42d02847e",
            "path": "https://firebasestorage.googleapis.com/v0/b/angular-firebase-demo-10001.appspot.com/o/adminManageAudio%2Fsong%2FThe_Weeknd_-_Creepin_320kbps_2.mp3?alt=media&token=3a030039-fd4b-43f2-b0ac-c4e4ed9c0436",
            "lyrics": null,
            "active": true,
            "album": null,
            "release": 1669914000000
        }
    ]

    for await (const iterator of data) {
        console.log(`Bài hát : ${iterator.name}`)
        const dt = Array(10).fill(1);
        let c = 1;
        for await (const iterator2 of dt) {
        console.log(`Bài hát : ${iterator.name} Copy # ${c}`)
            const dto = {
                name : iterator.name + ` #${c}`,
                id : iterator.id,
                image : iterator.image,
                path : iterator.path,
                release : iterator.release
            }
            await mintItemSolanaChain(dto);
            await sleep();
            c++;
        }
    }
  };

  const sleep = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(1)
      }, 3500)
    })
  }

const  mintItemSolanaChain = async (data: any) => {
  // see "Detecting the Provider"
  const collectionAddress = 'ADT8bCj4vzCgvXa9EtDNsukmsJQAPqvFkEiwezkuo8Br'
  const symbol = 'OSNFT';
  const attributes: any[] = [
    {
        trait_type : 'name',
        value : data?.name
    },
    {
        trait_type : 'id',
        value : data?.id
    },
    {
        trait_type : 'release',
        value : data?.release
    },
    {
        trait_type : 'audio',
        value : data?.path
    }
  ];
//   Object.entries(data?.metadata).forEach(([key, value]) => {
//     if (key !== 'aclass') {
//       const t = {
//         trait_type: key,
//         value: value,
//       };
//       attributes.push(t);
//     }
//   });
//   const network = clusterApiUrl('devnet');
//   const connection = new Connection(network, 'confirmed');
//   const collectionDetail = await metaplex
//     .nfts()
//     .findByMint({
//       mintAddress: new PublicKey(collectionAddress),
//     })
//   const currentCollectionSize = Number(
//     collectionDetail.collectionDetails?.size.toString()
//   );
//   const nftHashNumber = currentCollectionSize + 1;

  const metadata: JsonMetadata = {
    name:data?.name ,
    symbol,
    description: data?.description,
    seller_fee_basis_points: 500,
    image: data?.image,
    // external_url:'onesound.io',
    attributes,
    properties: {
      files: [
        {
          uri: data?.image,
          type: 'image/png',
        },
            {
                uri: data?.path,
                type: 'audio/mp3',
            },
      ],
      category: 'image',
      creators: [
        {
          address: 'HhFkAPaXQRdGj56ZckE1BMMCPXXUCmrPERwSaNHrhAhH',
          share: 100,
        },
      ],
    },
  };
//   const saveAsset = await this.upload({
//     metadata: {
//       path: 'metadata.json',
//       content: {
//         ...metadata
//       }
//     }
//   });
  const metadataURI = await uploadMetadata(metadata);

  try {
    const mintNFTResponse = await metaplex
      .nfts()
      .create({
        uri: metadataURI,
        name: data?.name,
        sellerFeeBasisPoints: 500,
        symbol: 'OSNFT',
        collection: new PublicKey(collectionAddress),
        
      })

    console.log(mintNFTResponse);
    console.log('mintAddress', mintNFTResponse.mintAddress.toBase58());
    console.log('tokenAddress', mintNFTResponse.tokenAddress.toBase58());
    console.log('metadataAdress', mintNFTResponse.metadataAddress.toBase58());

    const block_hash = await connection.getLatestBlockhash();
    const slot = await connection.getSlot('confirmed');
    const dto = {
      token_address: mintNFTResponse.tokenAddress.toString(),
      from_address: `dead_address`,
      to_address: collectionAddress,
      hash: mintNFTResponse.response.signature,
      token_id: mintNFTResponse.mintAddress.toString(),
      block_hash: block_hash.blockhash,
      lastValidBlockHeight: block_hash.lastValidBlockHeight,
      amount: 1,
      is_scanned: false,
      confirmed: false,
      decimal: 0,
      value: '1',
      slot,
    };
    console.log(dto);
    return dto;
  } catch (error) {
    console.log(error);
    return error;
  }
}
  
  
//   const updateMetadata = async () => {
//     const mintAddress = new PublicKey(SETTING_BY_AGRUMENTS.TANK_COLLECTION_ADDRESS);
  
//     const nft = await metaplex.nfts().findByMint({ mintAddress });
//     //   const find = metaplex.nfts();
//     const update = await metaplex.nfts().update({
//       nftOrSft: nft,
//       name: "Legends of Tank",
//     });
//     console.log(update);
//   };
  runCommand();

  
  // updateMetadata();
  
//   const unVerifyCollectionNFT = async (_mintAddress: PublicKey) => {
//     const res = await metaplex.nfts().unverifyCollection({
//       mintAddress: _mintAddress,
//       collectionMintAddress: new PublicKey(
//         SETTING_BY_AGRUMENTS.TANK_COLLECTION_ADDRESS
//       ),
//     });
//     // .run();
//     console.log(res);
//     return res;
//   };