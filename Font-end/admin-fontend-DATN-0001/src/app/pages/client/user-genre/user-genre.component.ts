import {GenreServiceService} from '../../adminPage/adminEntityService/adminService/genre-service.service';
import {SingerService} from '../../adminPage/adminEntityService/adminService/singer-service.service';
import {SongGenreService} from '../../adminPage/adminEntityService/adminService/song-genre.service';
import {SongSingerService} from '../../adminPage/adminEntityService/adminService/song-singer.service';
import {SongGenre} from '../../adminPage/adminEntityService/adminEntity/song/songGenre';
import {SongSinger} from '../../adminPage/adminEntityService/adminEntity/song/songSinger';
import {SongService} from '../../adminPage/adminEntityService/adminService/song.service';
import {SongAlbum} from '../../adminPage/adminEntityService/adminEntity/song/songAlbum';
import {AlbumService} from '../../adminPage/adminEntityService/adminService/album/album.service';
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

@Component({
  selector: 'app-user-genre',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-genre.component.html',
  styleUrl: './user-genre.component.scss',
})
export class UserGenreComponent implements OnInit {
  genres: Genre[] = [];
  singerMap: { [key: number]: any[] } = {};
  genreMap: { [key: number]: any[] } = {};
  acc?: account | null;

  constructor(
    private favSong: FavoriteService,
    private userService: accountServiceService,
    private matDialog: MatDialog,
    private SingerService: SingerService,
    private GenreService: GenreServiceService,
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
    this.recordVisit()
    this.getAllAlbum();
  }


  recordVisit() {
    this.statisticsService.recordVisit().subscribe((res) => {
        console.log(res);

      }, error => {
        console.log('error record visit ');

      }
    )
  }

  getAllAlbum(): void {
    this.GenreService.getAllGenres().subscribe(async (data) => {
      this.genres = data;
      console.log('aaa' + this.genres);
      console.log('asa' + data);
      this.genres = data;

      for (const hotArt of this.genres) {
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


  gotoDetailGenre(artist: Genre): void {
    this.router.navigate(['/onesound/home/genre/', artist.id]);
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
}
