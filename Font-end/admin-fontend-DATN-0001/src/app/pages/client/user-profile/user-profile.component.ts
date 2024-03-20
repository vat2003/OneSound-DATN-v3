import { SongService } from './../../adminPage/adminEntityService/adminService/song.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SingerService } from '../../adminPage/adminEntityService/adminService/singer-service.service';
import { Singer } from '../../adminPage/adminEntityService/adminEntity/singer/singer';
import { FirebaseStorageCrudService } from '../../../services/firebase-storage-crud.service';
import { Song } from '../../adminPage/adminEntityService/adminEntity/song/song';
import { Author } from '../../adminPage/adminEntityService/adminEntity/author/author';
import { Genre } from '../../adminPage/adminEntityService/adminEntity/genre/genre';
import { SongSingerService } from '../../adminPage/adminEntityService/adminService/song-singer.service';
import { SongGenreService } from '../../adminPage/adminEntityService/adminService/song-genre.service';
import { GenreServiceService } from '../../adminPage/adminEntityService/adminService/genre-service.service';
import { AuthorService } from '../../adminPage/adminEntityService/adminService/author.service';
import { SongAuthorService } from '../../adminPage/adminEntityService/adminService/song-author.service';
import { forkJoin, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  id!: number;
  singer: Singer = new Singer();
  singers: Singer[] = [];
  songs: Song[] = [];
  authors: Author[] = [];
  genres: Genre[] = [];
  singerMap: { [key: number]: any[] } = {};
  genreMap: { [key: number]: any[] } = {};
  authorMap: { [key: number]: any[] } = {};
  constructor(
    private route: ActivatedRoute,
    private singerService: SingerService,
    private firebaseStorage: FirebaseStorageCrudService,
    private SongSingerService: SongSingerService,
    private SongGenreService: SongGenreService,
    private GenreServiceService: GenreServiceService,
    private AuthorService: AuthorService,
    private SongAuthorService: SongAuthorService,
    private SongService: SongService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    // alert(this.id)
    this.loadSinger();
    this.getRelativeArtist();
    this.getAllSongs();
  }
  // private getSingerById() {
  //   this.singerService.getArtistById(this.id).subscribe(
  //     (data) => {
  //       this.singer = data;
  //     },
  //     (error) => console.log(error)
  //   );
  // }

  getAllSongs(): void {
    this.SongSingerService.getAllSongBySinger(this.id).pipe(
      map((data) => data.map(song => this.SongService.getSongById(song.id)))
    ).subscribe((observables) => {
      forkJoin(observables).subscribe((songs) => {
        this.songs = songs;
        console.log("Hehehehehheheheh" + this.songs);
        this.getSingersForSongs();
        this.getGenresForSongs();
        this.getAuthorsForSongs();
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

  getGenresForSongs() {
    const observables = this.songs.map(song => {
      return this.SongGenreService.getAllGenreBySong(song.id).pipe(
        switchMap(genres => {
          const singerObservables = genres.map(genres => this.GenreServiceService.getGenre(genres.genre.id));
          return forkJoin(singerObservables).pipe(
            map(singerDataArray => {
              return { songId: song.id, genres: singerDataArray };
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
              return { songId: song.id, authors: singerDataArray };
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
    this.singerService.getAllArtists().subscribe(data => {
      for (let i = 0; i < 5; i++) {
        this.singers.push(data[i]);
        console.log("ĐỀ XUẤT CA SĨ: " + this.singers[i].fullname);
      }
    });
  }


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
