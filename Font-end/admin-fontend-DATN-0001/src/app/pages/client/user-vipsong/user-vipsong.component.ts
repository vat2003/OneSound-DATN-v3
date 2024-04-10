import { Component } from '@angular/core';
import { Song } from '../../adminPage/adminEntityService/adminEntity/song/song';
import { Singer } from '../../adminPage/adminEntityService/adminEntity/singer/singer';
import { Genre } from '../../adminPage/adminEntityService/adminEntity/genre/genre';
import { account } from '../../adminPage/adminEntityService/adminEntity/account/account';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SongService } from '../../adminPage/adminEntityService/adminService/song.service';
import { ActivatedRoute } from '@angular/router';
import { SingerService } from '../../adminPage/adminEntityService/adminService/singer-service.service';
import { SongSingerService } from '../../adminPage/adminEntityService/adminService/song-singer.service';
import { SongGenreService } from '../../adminPage/adminEntityService/adminService/song-genre.service';
import { GenreServiceService } from '../../adminPage/adminEntityService/adminService/genre-service.service';
import { FirebaseStorageCrudService } from '../../../services/firebase-storage-crud.service';
import { FavoriteService } from '../../../services/favorite-service/favorite.service';
import { accountServiceService } from '../../adminPage/adminEntityService/adminService/account-service.service';
import { DataGlobalService } from '../../../services/data-global.service';
import { UserPlaylistModalComponent } from '../user-playlist-modal/user-playlist-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import axios from 'axios';
import { SongSinger1 } from '../../adminPage/adminEntityService/adminEntity/song/SongSinger1';

@Component({
  selector: 'app-user-vipsong',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],

  templateUrl: './user-vipsong.component.html',
  styleUrl: './user-vipsong.component.scss'
})
export class UserVipsongComponent {
 // songs: Song[] = [];
 songs: Song[] = [];
 SongSinger1: Singer[] = [];

 namevalue!: any[];
 namevalue2: any[] = [];

 // songs1: any[] = [];
 id!: any;
 singers: Singer[] = [];
 genres: Genre[] = [];
 acc?: account | null;
 favListSongs: any[] = [];
 songsfromdata: Song[] = [];
 pageSize: number = 20;
 qtt: number = 0;
 p: number = 1;
 localStorage?: Storage;
 page: number = 1;
 itempage: number = 4;
 filterOptionsSinger!: Observable<string[]>;
 singerMap: { [key: number]: any[] } = {};
 genreMap: { [key: number]: any[] } = {};


 constructor(
   private matDialog: MatDialog,
   private SongService: SongService,
   private route: ActivatedRoute,
   private singerService: SingerService,
   private SongSingerService: SongSingerService,
   private SongGenreService: SongGenreService,
   private GenreServiceService: GenreServiceService,
   private firebaseStorage: FirebaseStorageCrudService,
   private favSong: FavoriteService,
   private userService: accountServiceService,
   private dataGlobal: DataGlobalService
 ) {}

 ngOnInit(): void {
   this.acc = this.userService.getUserResponseFromLocalStorage();
   this.id = this.route.snapshot.params['id'];
  //  this.getAllSongs();
  // this.getSingersForSongs();
   this.getAllNftsByOwner();
  //  this.getAllSongs();
 }

 getAllSongs(): void {
   this.SongService.getAllSongs().subscribe((data) => {
     data.forEach(async (song) => {
       song.image = await this.setImageURLFirebase(song.image);
     });
     if (data.length > 100) {
      for (let i = data.length -1; i >= data.length - 100; i--) {
          this.songs.push(data[i]);
      }
      console.log("TOP 10 bài hát mới: ", this.songs);
  } else {
          this.songs=data;
          this.songs=this.songs.reverse();
      console.log("Tất cả các bài hát mới: ", this.songs);
  }
     // this.songs1 = this.songsfromdata;

    //  this.getGenresForSongs();
    //  this.getSingersForSongs();
   });
 }

 getSingersForSongs() {
  debugger
   const observables = this.songs.map((song) => {
     return this.SongSingerService.getAllSingerBySong(song.id).pipe(
       switchMap((singers) => {
  debugger

         const singerObservables = singers.map((singer) =>
           this.singerService.getArtistById(singer.singer.id)
         );
         return forkJoin(singerObservables).pipe(
           map((singerDataArray) => {
             return { songId: song.id, singers: singerDataArray };
           })
         );
       })
     );
   });

   forkJoin(observables).subscribe((results) => {
     results.forEach((result) => {
  debugger
       this.singerMap[result.songId] = result.singers;
     });
     console.log('Singer Map:', this.singerMap);
   });
 }

 getGenresForSongs() {
  const observables = this.songs.map(song => {
    return this.SongGenreService.getAllGenreBySong(song.id).pipe(
      switchMap(genres => {
        const singerObservables = genres.map(genres => this.GenreServiceService.getGenre(genres.genre.id));
        return forkJoin(singerObservables).pipe(
          map(singerDataArray => {
            return {songId: song.id, genres: singerDataArray};
          })
        );
      })
    );
  });

  forkJoin(observables).subscribe(results => {
    results.forEach(result => {
      this.genreMap[result.songId] = result.genres;
    });
    console.log("Genre Map:", this.genreMap);
  });
}


 async setImageURLFirebase(image: string): Promise<string> {
   if (image != null) {
     return await this.firebaseStorage.getFile(image);
   } else {
     return 'null';
   }
 }

 openDialog(songInput: Song) {
   const dialogRef = this.matDialog.open(UserPlaylistModalComponent, {
     data: { song: songInput },
   });

   dialogRef.afterOpened().subscribe(() => {
     this.getAllSongs();
   });
   dialogRef.afterClosed().subscribe((result) => {});
 }

//  getAllSongFavByUser() {
//    if (this.acc && this.acc.id) {
//      this.favSong.getAllFavSongByUser(this.acc.id).subscribe((data) => {
//        this.favListSongs = data;
//        console.log('this.favListSongs from playsong comp', this.favListSongs);

//        this.checkFav();
//      });
//    }
//  }


 async showDetail(item: any) {
   item.path = await this.setImageURLFirebase(item.path);
   this.dataGlobal.changeId(item);
   this.dataGlobal.setItem('songHeardLast', item);

   this.dataGlobal.changeArr(this.songs);
 }

async getAllNftsByOwner() {
  try {
    const res = await axios.post('https://api.devnet.solana.com', {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "getAssetsByOwner",
      "params": {
        "ownerAddress": "HiSpfJLbLW7H14s1NAQzCD6aM4K96nkmaiBjpNcFyjN7",
        "page": 1,
        "limit": 100
      }
    });

    console.log("DATA NÈ EM", res.data);

    const data: any[] = res.data.result.items;
    console.log("DỮ LIỆU: ", data);

    const transformedData = data.map(m => {
      const att: any = {};
      const originAtt = m?.content?.metadata?.attributes || [];
      originAtt.forEach((element: any) => {
        if (element?.value) {
          att[element?.trait_type] = element?.value
        }
      });
      const dto = {
        id: m.id, // Thêm trường id vào DTO
        image_uri: m?.content?.files[0]?.uri,
        path_uri: m?.content?.files[1]?.uri,
        ...att,
        owner: m?.ownership?.owner
      }
      return dto
    });

    const lisIds = Array.from(new Set(transformedData.map(m => m?.id)));
    const d = lisIds.map(m => {
      const r = transformedData.filter(f => f.id === m);
      return {
        ...r[0], numberOfCopies: r.length
      };
    })

    console.log("NHẠC NÈ: ", d)

    for (let a of d) {
      console.log("ID NHẠC: ", a.id);
      // try {
      //   const song = await this.SongService.getSongById(a.id).toPromise();
      //   if (song) {
      //     // const SongSinger1:Singer[]|undefined = await this.SongSingerService.getsinger(a.id).toPromise();
      //     this.SongSingerService.getAllSingerBySong(a.id).subscribe(data=>{
      //       // song.singer.push(data.singer.);
      //     })
      //     song.image = await this.setImageURLFirebase(song.image);

      //     this.songs.push(song);
      //     if (SongSinger1) {
      //       // this.SongSinger1.push(SongSinger1);
      //     }
      //     console.log("BÀI HÁT: ", this.songs);
      //     debugger
      //     console.log("CA SĨ: ", this.SongSinger1);

      //     song.singer=this.SongSinger1


      //   } else {
      //     console.error(`Không tìm thấy bài hát với ID ${a.id}`);
      //   }
      // } catch (error) {
      //   console.error('Lỗi khi lấy thông tin bài hát hoặc ca sĩ:', error);
      // }
try {
  if(!a.id.NaN){
    this.SongService.getSongById(a.id).subscribe( async data=>{
      data.image = await this.setImageURLFirebase(data.image);
      data.singer=a.numberOfCopies;
      this.songs.push(data);
      this.getSingersForSongs();
    })
  }

} catch (error) {
  console.error("LỖI: ",error)
}


    }
  } catch (error) {
    console.log("CAN't load: ", error)
  }
}

// async getAllNftsByOwner() {
//   try {
//     const res = await axios.post('https://api.devnet.solana.com', {
//       "jsonrpc": "2.0",
//       "id": 1,
//       "method": "getAssetsByOwner",
//       "params": {
//         "ownerAddress": "HiSpfJLbLW7H14s1NAQzCD6aM4K96nkmaiBjpNcFyjN7",
//         "page": 1,
//         "limit": 100
//       }
//     });

//     console.log("DATA NÈ EM", res.data);

//     const data: any[] = res.data.result.items;
//     console.log("DỮ LIỆU: ", data);

//     const transformedData = data.map(m => {
//       const att: any = {};
//       const originAtt = m?.content?.metadata?.attributes || [];
//       originAtt.forEach((element: any) => {
//         if (element?.value) {
//           att[element?.trait_type] = element?.value
//         }
//       });
//       const dto = {
//         id: m.id, // Thêm trường id vào DTO
//         image_uri: m?.content?.files[0]?.uri,
//         path_uri: m?.content?.files[1]?.uri,
//         ...att,
//         owner: m?.ownership?.owner
//       }
//       return dto
//     });

//     const lisIds = Array.from(new Set(transformedData.map(m => m?.id)));
//     const d = lisIds.map(m => {
//       const r = transformedData.filter(f => f.id === m);
//       return {
//         ...r[0], numberOfCopies: r.length
//       };
//     })

//     console.log("NHẠC NÈ: ", d);

//     for (let a of d) {
//       console.log("ID NHẠC: ", a.id);
//       await this.processSong(a.id);
//     }
//   } catch (error) {
//     console.log("CAN't load: ", error)
//   }
// }

// async processSong(id: number) {
//   try {
//     const song = await this.SongService.getSongById(id).toPromise();
//     if (song) {
//       song.image = await this.setImageURLFirebase(song.image);
//       this.songs.push(song);
//       await this.processSingersForSong(id);
//     } else {
//       console.error(`Không tìm thấy bài hát với ID ${id}`);
//     }
//   } catch (error) {
//     console.error('Lỗi khi lấy thông tin bài hát:', error);
//   }
// }

// async processSingersForSong(songId: number) {
//   try {
//     const id: any = await this.SongSingerService.getAllSingerBySong(songId).toPromise();
//     const singerObservables = id.map((singer: any) =>
//       this.singerService.getArtistById(singer.singer.id)
//     );
//     const singerDataArray: any = await forkJoin(singerObservables).toPromise();
//     this.singerMap[songId] = singerDataArray;
//     console.log('Singer Map:', this.singerMap);
//   } catch (error) {
//     console.error('Lỗi khi lấy thông tin các ca sĩ:', error);
//   }
// }


}
