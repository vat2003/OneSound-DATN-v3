import {GenreServiceService} from './../../adminPage/adminEntityService/adminService/genre-service.service';
import {SingerService} from './../../adminPage/adminEntityService/adminService/singer-service.service';
import {SongGenreService} from './../../adminPage/adminEntityService/adminService/song-genre.service';
import {SongSingerService} from './../../adminPage/adminEntityService/adminService/song-singer.service';
import {SongGenre} from './../../adminPage/adminEntityService/adminEntity/song/songGenre';
import {SongSinger} from './../../adminPage/adminEntityService/adminEntity/song/songSinger';
import {SongService} from './../../adminPage/adminEntityService/adminService/song.service';
import {SongAlbum} from './../../adminPage/adminEntityService/adminEntity/song/songAlbum';
import {AlbumService} from './../../adminPage/adminEntityService/adminService/album/album.service';
import {Component, OnInit} from '@angular/core';
// import { SingerService } from '../../adminPage/adminEntityService/adminService/singer-service.service';
import {Singer} from '../../adminPage/adminEntityService/adminEntity/singer/singer';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {FirebaseStorageCrudService} from '../../../services/firebase-storage-crud.service';
import {Router} from '@angular/router';
import {StaticticalService} from '../../adminPage/adminEntityService/adminService/statictical/statictical.service';
import {error} from 'console';
import {Album} from '../../adminPage/adminEntityService/adminEntity/album/album';
import {Observable, forkJoin, map, switchMap} from 'rxjs';
import {Song} from '../../adminPage/adminEntityService/adminEntity/song/song';
import {Genre} from '../../adminPage/adminEntityService/adminEntity/genre/genre';
import {aborted} from "node:util";
import {addWarning} from "@angular-devkit/build-angular/src/utils/webpack-diagnostics";
import {UserPlaylistModalComponent} from "../user-playlist-modal/user-playlist-modal.component";
import {FavoriteSong} from "../../adminPage/adminEntityService/adminEntity/favoriteYoutube/favorite-song";
import {MatDialog} from "@angular/material/dialog";
import {accountServiceService} from "../../adminPage/adminEntityService/adminService/account-service.service";
import {account} from "../../adminPage/adminEntityService/adminEntity/account/account";
import {FavoriteService} from "../../../services/favorite-service/favorite.service";
import {DataGlobalService} from '../../../services/data-global.service';
import axios from 'axios';

@Component({
  selector: 'app-user-explore',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-explore.component.html',
  styleUrl: './user-explore.component.scss',
})
export class UserExploreComponent implements OnInit {
  hotArtist: Singer[] = [];
  albums: Album[] = [];
  songs: any[] = [];
  singers: Singer[] = [];
  genres: Genre[] = [];
  singerMap: { [key: number]: any[] } = {};
  genreMap: { [key: number]: any[] } = {};
  acc?: account | null;
  favListSongs: any[] = [];

  constructor(
    private favSong: FavoriteService,
    private userService: accountServiceService,
    private matDialog: MatDialog,
    private SingerService: SingerService,
    private AlbumService: AlbumService,
    private firebaseStorage: FirebaseStorageCrudService,
    private router: Router,
    private statisticsService: StaticticalService,
    private SongService: SongService,
    private SongSingerService: SongSingerService,
    private SongGenreService: SongGenreService,
    // private SingerService:SingerService,
    private dataGlobal: DataGlobalService,
    private GenreServiceService: GenreServiceService
  ) {
  }

  index: number = 0;

  ngOnInit(): void {
    this.acc = this.userService.getUserResponseFromLocalStorage();
    this.getAllSongs();
    this.getAllArtist();
    this.recordVisit()
    this.getAllAlbum();
    this.songs.reverse();
    this.hotArtist.reverse();
    this.albums.reverse();
    this.getAllNftsByOwner();
  }


  recordVisit() {
    this.statisticsService.recordVisit().subscribe((res) => {
        console.log(res);

      }, error => {
        console.log('error record visit ');

      }
    )
  }


  getAllArtist(): void {
    this.SingerService.getAllArtists().subscribe(async (data) => {
      this.hotArtist = data;
      console.log(this.hotArtist);
      console.log(data);
      this.hotArtist = data;

      for (const hotArt of this.hotArtist) {
        if (hotArt.image == null || hotArt.image == '') {
          continue;
        }
        hotArt.image = await this.setImageURLFirebase(hotArt.image);
      }
      // console.log(data);
    });
  }

  async showDetail(item: any) {
    item.path = await this.setImageURLFirebase(item.path);
    this.dataGlobal.changeId(item);
    this.dataGlobal.setItem('songHeardLast', item);
  }

  getAllAlbum(): void {
    this.AlbumService.getAllAlbumNormal().subscribe(async (data) => {
      this.albums = data;
      console.log('aaa' + this.albums);
      console.log('asa' + data);
      this.albums = data;

      for (const hotArt of this.albums) {
        if (hotArt.image == null || hotArt.image == '') {
          continue;
        }
        hotArt.image = await this.setImageURLFirebase(hotArt.image);
        console.log(hotArt.image)
      }
      // console.log(data);
    });
  }


  async setImageURLFirebase(image: string): Promise<string> {
    if (image != null) {
      return await this.firebaseStorage.getFile(image);
    } else {
      return 'null';
    }
  }


  gotoDetailArtist(artist: Singer): void {
    this.router.navigate(['/onesound/home/profile/', artist.id]);
  }

  gotoDetailAlbum(album: Album): void {
    this.router.navigate(['/onesound/home/album/', album.id]);
  }

  // getAllSongs():void{
  //   this.SongService.getAllSongs().subscribe(async (data)  => {
  //     if(data.length>10){
  //       this.songs.slice(data.length-11)
  //       for (const hotArt of this.songs) {
  //         if (hotArt.image == null || hotArt.image == '') {
  //           continue;
  //         }
  //         hotArt.image = await this.setImageURLFirebase(hotArt.image);
  //       }
  //     this.getSingersForSongs();
  //     this.getGenresForSongs();
  //     }
  //     else{
  //       this.songs = data;
  //       for (const hotArt of this.songs) {
  //         if (hotArt.image == null || hotArt.image == '') {
  //           continue;
  //         }
  //         hotArt.image = await this.setImageURLFirebase(hotArt.image);
  //       }
  //     this.getSingersForSongs();
  //     this.getGenresForSongs();
  //     }

  //     for (let i = 0; i < this.songs.length; i++) {
  //       this.songs[i].image = await this.setImageURLFirebase(this.songs[i].image);
  //     }
  //       console.log("BÀI HÁT NÈ: ", this.songs);

  //   });

  // }

  getAllSongs(): void {
    this.SongService.getAllSongs().subscribe(async (data) => {
      // this.songs = data;
      console.log(this.albums);
      if (data.length > 10) {
        for (let i = data.length -1; i >= data.length - 10; i--) {
            this.songs.push(data[i]);
        }
        console.log("TOP 10 bài hát mới: ", this.songs);
    } else {
            this.songs=data;
        console.log("Tất cả các bài hát mới: ", this.songs);
    }

    // console.log("SẮP XÊP")
      for (const hotArt of this.songs) {
        if (hotArt.image == null || hotArt.image == '') {
          continue;
        }
        hotArt.image = await this.setImageURLFirebase(hotArt.image);
      }
      this.getSingersForSongs();
      this.getGenresForSongs();
      // console.log(data);
    });
  }

  getSingersForSongs() {
    const observables = this.songs.map(song => {
      return this.SongSingerService.getAllSingerBySong(song.id).pipe(
        switchMap(singers => {
          const singerObservables = singers.map(singer => this.SingerService.getArtistById(singer.singer.id));
          return forkJoin(singerObservables).pipe(
            map(singerDataArray => {
              return {songId: song.id, singers: singerDataArray};
            })
          );
        })
      );
    });

    forkJoin(observables).subscribe(results => {
      results.forEach(result => {
        this.singerMap[result.songId] = result.singers;
      });
      console.log("Singer Map:", this.singerMap);
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

  openDialog(songInput: Song) {
    const dialogRef = this.matDialog.open(UserPlaylistModalComponent, {
      data: {song: songInput}
    });

    dialogRef.afterOpened().subscribe(() => {
      this.getAllSongs();

    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  getAllSongFavByUser() {
    if (this.acc && this.acc.id) {
      this.favSong.getAllFavSongByUser(this.acc.id).subscribe((data) => {
        this.favListSongs = data;
        // console.log(this.favListSongs);

        this.checkFav();
      });
    }
  }

  checkFav() {
    for (let song of this.songs) {
      let found = this.favListSongs.find((fav) => fav.song.id === song.id);
      song.isFav = found ? true : false;
    }
  }

  favoriteSong(song: any) {
    // alert(song.id);
    let songId = song.id;
    let favS = new FavoriteSong(this.acc?.id, songId);
    if (
      this.acc == null ||
      this.acc == undefined ||
      this.acc === null ||
      this.acc === undefined
    ) {
      alert('Please log in to use this feature');
      return;
    }
    if (song.isFav) {
      if (!confirm('Are you sure you want to unlike?')) {
        return;
      }
      song.isFav = false;
      this.favSong.deleteFavoriteSong(favS).subscribe((data) => {
      });
    } else {
      song.isFav = true;
      this.favSong.addFavoriteSong(favS).subscribe((data) => {
      });
    }
  }

  async getAllNftsByOwner () {
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

    debugger

    const data = res.data; // Lấy mảng dữ liệu từ phản hồi
    console.log("date ne "+data);


    // Sử dụng forEach để duyệt qua từng item trong mảng dữ liệu và log ra
    data.forEach((item:any) => {
        console.log("ITEM NÈ: ",item); // Log ra mỗi item
    });

}


}
