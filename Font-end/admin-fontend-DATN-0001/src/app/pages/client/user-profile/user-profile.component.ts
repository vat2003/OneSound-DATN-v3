import {SingerAlbum} from './../../adminPage/adminEntityService/adminEntity/singerAlbum/singer-album';
import {SingerAlbumService} from './../../adminPage/adminEntityService/adminService/singerAlbum/singer-album.service';
import {accountServiceService} from './../../adminPage/adminEntityService/adminService/account-service.service';
import {SongService} from './../../adminPage/adminEntityService/adminService/song.service';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {SingerService} from '../../adminPage/adminEntityService/adminService/singer-service.service';
import {Singer} from '../../adminPage/adminEntityService/adminEntity/singer/singer';
import {FirebaseStorageCrudService} from '../../../services/firebase-storage-crud.service';
import {Song} from '../../adminPage/adminEntityService/adminEntity/song/song';
import {Author} from '../../adminPage/adminEntityService/adminEntity/author/author';
import {Genre} from '../../adminPage/adminEntityService/adminEntity/genre/genre';
import {SongSingerService} from '../../adminPage/adminEntityService/adminService/song-singer.service';
import {SongGenreService} from '../../adminPage/adminEntityService/adminService/song-genre.service';
import {GenreServiceService} from '../../adminPage/adminEntityService/adminService/genre-service.service';
import {AuthorService} from '../../adminPage/adminEntityService/adminService/author.service';
import {SongAuthorService} from '../../adminPage/adminEntityService/adminService/song-author.service';
import {Observable, forkJoin, map, mergeMap, switchMap} from 'rxjs';
import {DatePipe, NgFor, NgIf} from '@angular/common';
import {NgxPaginationModule} from 'ngx-pagination';
import {account} from '../../adminPage/adminEntityService/adminEntity/account/account';
import {AlbumService} from '../../adminPage/adminEntityService/adminService/album/album.service';
import {Album} from '../../adminPage/adminEntityService/adminEntity/album/album';
import {NgForOf} from "@angular/common";
import {DataGlobalService} from "../../../services/data-global.service";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    NgIf, NgFor,
    NgxPaginationModule,
    NgForOf, RouterLink
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  id!: number;
  singer: Singer = new Singer();
  singers: Singer[] = [];
  songs: Song[] = [];
  albums: Album[] = [];
  authors: Author[] = [];
  genres: Genre[] = [];
  singerMap: { [key: number]: any[] } = {};
  singerAlbumMap: { [key: number]: any[] } = {};
  genreMap: { [key: number]: any[] } = {};
  authorMap: { [key: number]: any[] } = {};
  pageSize: number = 5;
  qtt: number = 0;
  p: number = 1;
  localStorage?: Storage;
  page: number = 1;
  itempage: number = 4;
  users: account[] = [];
  forceDate: any;
  acc?: account | null;

  constructor(
    private route: ActivatedRoute,
    private singerService: SingerService,
    private firebaseStorage: FirebaseStorageCrudService,
    private SongSingerService: SongSingerService,
    private SongGenreService: SongGenreService,
    private GenreServiceService: GenreServiceService,
    private AuthorService: AuthorService,
    private SongAuthorService: SongAuthorService,
    private SongService: SongService,
    private accountServiceService: accountServiceService,
    private albumService: AlbumService,
    private SingerAlbumService: SingerAlbumService,
    private router: Router,
    private dataGlobal: DataGlobalService
  ) {
  }

  ngOnInit(): void {
    this.acc = this.accountServiceService.getUserResponseFromLocalStorage();
    this.id = this.route.snapshot.params['id'];
    this.getAllSongs();
    this.loadSinger();
    this.getRelativeArtist();
    this.getAllUser();
    this.getAllAlbum();
    this.countSong(this.albums[length - 1])
  }

  gotoDetailAlbum(album: Album): void {
    this.router.navigate(['/onesound/home/album/', album.id]);
  }

  countSong(album: Album) {
    this.albumService.getAlbumById(album.id).subscribe(data => {
      this.songs = data.songs;
      console.log("BÀI HÁT TRONG ALBUM: " + this.songs);
      this.qtt = this.songs.length;
    })
  }
  async showDetail(item: any) {
    item.path = await this.setImageURLFirebase(item.path);
    this.dataGlobal.changeId(item);
    this.dataGlobal.setItem('songHeardLast', item);
  }

  // private getSingerById() {
  //   this.singerService.getArtistById(this.id).subscribe(
  //     (data) => {
  //       this.singer = data;
  //     },
  //     (error) => console.log(error)
  //   );
  // }

  // getAllSongs(): void {
  //   this.SongSingerService.getAllSongBySinger(this.id).pipe(
  //     mergeMap((data) => {
  //       const observables = data.map(song => this.SongService.getSongById(song.id));
  //       return forkJoin(observables);
  //     })
  //   ).subscribe((songs) => {
  //     this.songs = songs;
  // console.log("Hehehehehheheheh", this.songs);
  // this.getSingersForSongs();
  // this.getGenresForSongs();
  // this.getAuthorsForSongs();
  //   });

  // }

  getAllUser() {
    this.accountServiceService.getAllUsers().subscribe(data => {
      if (data.length >= 5) {
        const mang = data.length - 5;
        for (let i = mang; i < 6; i++) {
          this.users.push(data[i]);
          console.log("NGỪI DÙNG NÈ PÉ: " + this.users);
        }
      } else {
        this.users = data;
      }
    })
  }

  getAllAlbum() {
    this.SingerAlbumService.getAllAlbumBySinger(this.id).subscribe(async data => {
      const promises = [];
      for (const song of data) {
        const promise = new Promise<Album>((resolve, reject) => {
          // this.songs = data.content;
          this.albumService.getAlbumById(song.album.id).subscribe(async baihat => {
            baihat.image = await this.setImageURLFirebase(baihat.image);
            // baihat.release.toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'});
            resolve(baihat);
          });
        });
        promises.push(promise);
      }
      Promise.all(promises).then(albums => {
        this.albums = albums;
        console.log("Hehehehehheheheh", this.songs);
        this.getSingersForAlbums();
      }).catch(error => {
        console.error('Error fetching song images:', error);
      });
    })
  }

  getAllSongs() {
    this.SongSingerService.getAllSongBySinger(this.id).subscribe(async data => {
      const promises = [];
      for (const song of data) {
        const promise = new Promise<Song>((resolve, reject) => {
          // this.songs = data.content;
          this.SongService.getSongById(song.song.id).subscribe(async baihat => {
            baihat.image = await this.setImageURLFirebase(baihat.image);
            // baihat.release.toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'});
            resolve(baihat);
          });
        });
        promises.push(promise);
      }
      Promise.all(promises).then(songs => {
        for (let song of songs) {
          this.forceDate = new DatePipe('en-US').transform(song.release_date, 'MM-dd-yyyy');
          song.release_date = this.forceDate;
          // song.release.toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'});
        }
        this.songs = songs;
        console.log("Hehehehehheheheh" + this.songs);
        this.getSingersForSongs();
        this.getGenresForSongs();
        this.getAuthorsForSongs();
      }).catch(error => {
        console.error('Error fetching song images:', error);
      });
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


  getSingersForAlbums() {
    const observables = this.albums.map(song => {
      return this.SingerAlbumService.getAllSingerAlbumById(song.id).pipe(
        switchMap(singers => {
          const singerObservables = singers.map(singer => this.singerService.getArtistById(singer.singer.id));
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
        this.singerAlbumMap[result.songId] = result.singers;
      });
      console.log("Singer Map:", this.singerAlbumMap);
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

  getAuthorsForSongs() {
    const observables = this.songs.map(song => {
      return this.SongAuthorService.getAllAuthorBySong(song.id).pipe(
        switchMap(authors => {
          const singerObservables = authors.map(genres => this.AuthorService.getAuthorById(genres.author.id));
          return forkJoin(singerObservables).pipe(
            map(singerDataArray => {
              return {songId: song.id, authors: singerDataArray};
            })
          );
        })
      );
    });

    forkJoin(observables).subscribe(results => {
      results.forEach(result => {
        this.authorMap[result.songId] = result.authors;
      });
      console.log("Author Map:", this.authorMap);
    });
  }

  getRelativeArtist() {
    this.singerService.getAllArtists().subscribe(async data => {
      for (let i = 0; i < 3; i++) {
        data[i].image = await this.setImageURLFirebase(data[i].image);
        this.singers.push(data[i]);
        console.log("ĐỀ XUẤT CA SĨ: " + this.singers[i].fullname);
        console.log("ĐỀ XUẤT CA SĨ: " + this.singers[i].image);
      }
    });
  }

//

// reload() {
//   const currentUrl = this.router.url;
//   this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
//     this.router.navigate([currentUrl]);
//   });
// }


  getSingerById(): void {
    this.singerService.getArtistById(this.id).subscribe(async (data) => {
      this.singer = data;

      debugger;
      console.log(data);
      this.singer = data;

      this.singer.image = await this.setImageURLFirebase(this.singer.image);

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

  private loadSinger() {
    this.getSingerById();
  }
}
