import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Singer } from '../../adminPage/adminEntityService/adminEntity/singer/singer';
import { Song } from '../../adminPage/adminEntityService/adminEntity/song/song';
import { Album } from '../../adminPage/adminEntityService/adminEntity/album/album';
import { Author } from '../../adminPage/adminEntityService/adminEntity/author/author';
import { Genre } from '../../adminPage/adminEntityService/adminEntity/genre/genre';
import { account } from '../../adminPage/adminEntityService/adminEntity/account/account';
import { ActivatedRoute, Router } from '@angular/router';
import { SingerService } from '../../adminPage/adminEntityService/adminService/singer-service.service';
import { FirebaseStorageCrudService } from '../../../services/firebase-storage-crud.service';
import { SongSingerService } from '../../adminPage/adminEntityService/adminService/song-singer.service';
import { SongGenreService } from '../../adminPage/adminEntityService/adminService/song-genre.service';
import { GenreServiceService } from '../../adminPage/adminEntityService/adminService/genre-service.service';
import { AuthorService } from '../../adminPage/adminEntityService/adminService/author.service';
import { SongAuthorService } from '../../adminPage/adminEntityService/adminService/song-author.service';
import { SongService } from '../../adminPage/adminEntityService/adminService/song.service';
import { accountServiceService } from '../../adminPage/adminEntityService/adminService/account-service.service';
import { AlbumService } from '../../adminPage/adminEntityService/adminService/album/album.service';
import { SingerAlbumService } from '../../adminPage/adminEntityService/adminService/singerAlbum/singer-album.service';
import { DataGlobalService } from '../../../services/data-global.service';
import { Subject, forkJoin, map, switchMap } from 'rxjs';
import { NgxPaginationModule } from 'ngx-pagination';
import { MatDialog } from '@angular/material/dialog';
import { UserPlaylistModalComponent } from '../user-playlist-modal/user-playlist-modal.component';
import { FavoriteSong } from '../../adminPage/adminEntityService/adminEntity/favoriteYoutube/favorite-song';
import { FavoriteService } from '../../../services/favorite-service/favorite.service';

@Component({
  selector: 'app-user-genredetail',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './user-genredetail.component.html',
  styleUrl: './user-genredetail.component.scss'
})
export class UserGenredetailComponent {
  id!: number;
  singer: Singer = new Singer();
  singers: Singer[] = [];
  songs: Song[] = [];
  albums: Album[] = [];
  authors: Author[] = [];
  genre: Genre=new Genre();
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
  favListSongs: any[] = [];
  searchTerm: string = '';
  private searchTerms = new Subject<string>();
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
    private favSong: FavoriteService,
    private dataGlobal: DataGlobalService,
    private matDialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.acc = this.accountServiceService.getUserResponseFromLocalStorage();
    this.id = this.route.snapshot.params['id'];
    this.getAllSongs();
    this.loadSinger();
    this.getRelativeArtist();
    // this.getAllUser();
    this.getAllAlbum();
  }

  // gotoDetailAlbum(album: Genre): void {
  //   this.router.navigate(['/onesound/home/genre/', album.id]);
  // }



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
  search(): void {
    // this.searchTerms.next(this.searchTerm);
    const searchTermLowerCase = this.searchTerm.toLowerCase();
    // this.songs = this.songs.filter(author =>
    //   author.name.toLowerCase().includes(searchTermLowerCase) ||
    //   author.description.toLowerCase().includes(searchTermLowerCase)||
    //   author.album.title.toLowerCase().includes(searchTermLowerCase)
    // );
    this.songs = this.songs.filter((song: Song) => {
      return song.name.toLowerCase().includes(searchTermLowerCase);
    });
    if (searchTermLowerCase == '') {
      this.getAllSongs();
    }
  }

  onKey(event: any): void {
    this.searchTerms.next(event.target.value);
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
    this.SongGenreService.getAllSongByGenre(this.id).subscribe(async data => {
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
  const observables = this.songs.map(song => {
    return this.SongSingerService.getAllSingerBySong(song.id).pipe(
      switchMap(singers => {
        const singerObservables = singers.map(singer => this.singerService.getArtistById(singer.singer.id));
        return forkJoin(singerObservables).pipe(
          map(singerDataArray => {
            return { songId: song.id, singers: singerDataArray };
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
    this.GenreServiceService.getGenre(this.id).subscribe(async (data) => {
      this.genre = data;

      debugger;
      console.log(data);
      this.genre = data;

      this.genre.image = await this.setImageURLFirebase(this.genre.image);

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

  openDialog(songInput: Song) {
    const dialogRef = this.matDialog.open(UserPlaylistModalComponent, {
      data: { song: songInput },
    });

    dialogRef.afterOpened().subscribe(() => {
      this.getAllSongs();
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }

  checkFav() {
    // for (let song of this.songs) {
    //   let found = this.favListSongs.find((fav) => fav.song.id === song.id);
    //   song = found ? true : false;
    // }
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
      this.favSong.deleteFavoriteSong(favS).subscribe((data) => {});
    } else {
      song.isFav = true;
      this.favSong.addFavoriteSong(favS).subscribe((data) => {});
    }
  }
}
