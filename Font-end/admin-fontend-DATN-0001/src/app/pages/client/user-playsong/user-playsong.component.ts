import {AuthorService} from './../../adminPage/adminEntityService/adminService/author.service';
import {GenreServiceService} from './../../adminPage/adminEntityService/adminService/genre-service.service';
import {SongAuthorService} from './../../adminPage/adminEntityService/adminService/song-author.service';
import {SongGenreService} from './../../adminPage/adminEntityService/adminService/song-genre.service';
import {SongSingerService} from './../../adminPage/adminEntityService/adminService/song-singer.service';
import {AlbumService} from './../../adminPage/adminEntityService/adminService/album/album.service';
import {Component, OnInit, signal} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {UserPlaylistModalComponent} from '../user-playlist-modal/user-playlist-modal.component';
import {SongService} from '../../adminPage/adminEntityService/adminService/song.service';
import {Singer} from '../../adminPage/adminEntityService/adminEntity/singer/singer';
import {Song} from '../../adminPage/adminEntityService/adminEntity/song/song';
import {CommonModule, NgClass, NgForOf, NgStyle} from '@angular/common';
import {Album} from '../../adminPage/adminEntityService/adminEntity/album/album';
import {ActivatedRoute} from '@angular/router';
import {SingerService} from '../../adminPage/adminEntityService/adminService/singer-service.service';
import {FirebaseStorageCrudService} from '../../../services/firebase-storage-crud.service';
import {Observable, forkJoin, map, startWith, switchMap, Subject} from 'rxjs';
import {FormControl, FormsModule} from '@angular/forms';
import {Genre} from '../../adminPage/adminEntityService/adminEntity/genre/genre';
import {Author} from '../../adminPage/adminEntityService/adminEntity/author/author';
import {FavoriteSong} from '../../adminPage/adminEntityService/adminEntity/favoriteYoutube/favorite-song';
import {account} from '../../adminPage/adminEntityService/adminEntity/account/account';
import {FavoriteService} from '../../../services/favorite-service/favorite.service';
import {accountServiceService} from '../../adminPage/adminEntityService/adminService/account-service.service';
import {DataGlobalService} from '../../../services/data-global.service';
import {FavoriteAlbum} from '../../adminPage/adminEntityService/adminEntity/favoriteYoutube/favorite-album';
import {ShareSocialComponent} from '../share-social/share-social.component';

@Component({
  selector: 'app-user-playsong',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgStyle,
    CommonModule,
    FormsModule,
    ShareSocialComponent,
  ],
  templateUrl: './user-playsong.component.html',
  styleUrl: './user-playsong.component.scss',
})
export class UserPlaysongComponent implements OnInit {
  // songs: Song[] = [];
  songs: any[] = [];
  // songs1: any[] = [];
  id!: any;
  album: Album = new Album();
  song: Song = new Song();
  singers: Singer[] = [];
  genres: Genre[] = [];
  authors: Author[] = [];
  acc?: account | null;
  favListSongs: any[] = [];
  songsfromdata: Song[] = [];
  searchTerm: string = '';
  private searchTerms = new Subject<string>();

  isFavAlbum!: boolean;

  filterOptionsSinger!: Observable<string[]>;
  formcontrol = new FormControl('');
  singerMap: { [key: number]: any[] } = {};
  genreMap: { [key: number]: any[] } = {};
  authorMap: { [key: number]: any[] } = {};
  link!: string;
  playall: boolean = false;

  constructor(
    private matDialog: MatDialog,
    private SongService: SongService,
    private AlbumService: AlbumService,
    private route: ActivatedRoute,
    private singerService: SingerService,
    private SongSingerService: SongSingerService,
    private SongGenreService: SongGenreService,
    private GenreServiceService: GenreServiceService,
    private AuthorService: AuthorService,
    private SongAuthorService: SongAuthorService,
    private firebaseStorage: FirebaseStorageCrudService,
    private favSong: FavoriteService,
    private userService: accountServiceService,
    private dataGlobal: DataGlobalService
  ) {
  }

  ngOnInit(): void {
    this.acc = this.userService.getUserResponseFromLocalStorage();
    this.id = this.route.snapshot.params['id'];
    this.getAllSongs();
    this.getAlbumById();
    this.getAllSongFavByUser();
    this.checkFav();
    this.link = 'https://www.youtube.com/watch?v=w7f0Kq-pReI';
  }

  getAlbumFav() {
    this.isFavAlbum
  }

  getAllSongs(): void {
    this.SongService.getAllSongsByAlbumId(this.id).subscribe((data) => {
      data.forEach(async (song) => {
        song.image = await this.setImageURLFirebase(song.image);
      });

      this.songs = data;
      this.songsfromdata = data;
      // this.songs1 = this.songsfromdata;

      this.getSingersForSongs();
      this.getGenresForSongs();
      this.getAuthorsForSongs();
    });
  }

  getSingersForSongs() {
    this.songs.forEach(song => {
      this.SongSingerService.getAllSingerBySong(song.id).subscribe(data => {
        const singers = data.map(item => item.singer);
        this.singerMap[song.id] = singers;
      });
    });
  }

  getGenresForSongs() {
    debugger
    this.songs.forEach(song => {
      debugger
      this.SongGenreService.getAllGenreBySong(song.id).subscribe(data => {
        console.log("DATA GENRE: ", data)
        debugger
        const genres = data.map(item => item.genre);
        console.log("DATA GENRE T2: ", genres)
        debugger
        this.genreMap[song.id] = genres;
        console.log("DATA GENRE T3: ", this.genreMap[song.id])

      });
    });
  }

  search(): void {
    const searchTermLowerCase = this.searchTerm.trim().toLowerCase();
    this.songs = this.songs.filter(
      (list) => list.name.toLowerCase().includes(searchTermLowerCase)
      // ||
      //playlists..toLowerCase().includes(searchTermLowerCase)
    );

    if (searchTermLowerCase == '') {
      // this.timname(this.id);
      this.getAllSongs();
      this.getAlbumById();
      this.getAllSongFavByUser();
    }
  }

  onKey(event: any): void {
    this.searchTerms.next(event.target.value);
  }

  getAuthorsForSongs() {
    this.songs.forEach(song => {
      this.SongAuthorService.getAllAuthorBySong(song.id).subscribe(data => {
        console.log("DATA GENRE: ", data)
        const genres = data.map(item => item.author);
        console.log("DATA GENRE T2: ", genres)
        debugger
        this.authorMap[song.id] = genres;
        console.log("DATA GENRE T3: ", this.genreMap[song.id])

      });
    });
  }

  getAlbumById(): void {
    this.AlbumService.getAlbumById(this.id).subscribe(async (data) => {
      this.album = data;

      debugger;
      console.log(data);
      this.album = data;

      this.album.image = await this.setImageURLFirebase(this.album.image);

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

  share() {
    let link = 'http://localhost:4200/onesound/home/album/' + this.album.id;
    const dialogRef = this.matDialog.open(ShareSocialComponent, {
      data: {link},
    });
  }

  openDialog(songInput: Song) {
    const dialogRef = this.matDialog.open(UserPlaylistModalComponent, {
      data: {song: songInput},
    });

    dialogRef.afterOpened().subscribe(() => {
      this.getAllSongs();
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  getAllSongFavByUser() {
    if (this.acc && this.acc.id) {
      this.favSong.getAllFavSongByUser(this.acc.id).subscribe((data) => {
        this.favListSongs = data;
        console.log('this.favListSongs from playsong comp', this.favListSongs);

        this.checkFav();
      });
    }
  }

  checkFav() {
    if (this.acc?.id) {
      this.favSong
        .isAlbumLikedByUser(this.acc.id, this.id)
        .subscribe((data) => {
          console.log('isAlbumLikedByUser', this.isFavAlbum);
          this.isFavAlbum = data ? true : false;
        });

      let album = this.favSong
        .isAlbumLikedByUser(this.acc.id, this.id)
        .subscribe((data) => {
          console.log('isAlbumLikedByUser', this.isFavAlbum);
          this.isFavAlbum = data ? true : false;
        });

      // song.isFav = found ? true : false;
    }
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

  async showDetail(item: any) {
    item.path = await this.setImageURLFirebase(item.path);
    this.dataGlobal.changeId(item);
    this.dataGlobal.setItem('songHeardLast', item);

    this.dataGlobal.changeArr(this.songs);
  }

  favoriteAlbum() {
    let albumId = this.id;
    let favAlbum = new FavoriteAlbum(this.acc?.id, albumId);

    if (
      this.acc == null ||
      this.acc == undefined ||
      this.acc === null ||
      this.acc === undefined
    ) {
      alert('Please log in to use this feature');
      return;
    }
    if (this.isFavAlbum === true) {
      if (!confirm('Are you sure you want to unlike?')) {
        return;
      }
      this.isFavAlbum = false;
      this.favSong.deleteFavoriteAlbum(favAlbum).subscribe((data) => {
      });
    } else {
      this.isFavAlbum = true;
      this.favSong.addFavoriteAlbum(favAlbum).subscribe((data) => {
      });
    }
  }

  playAll() {
    this.playall = !this.playall;

    this.dataGlobal.onoffplayall(this.playall);

    this.dataGlobal.changeArr(this.songs);
  }

  shuffle() {
    this.songs.sort(() => Math.random() - 0.5);
    this.dataGlobal.changeArr(this.songs);
  }
}
