import { AuthorService } from './../../adminPage/adminEntityService/adminService/author.service';
import { GenreServiceService } from './../../adminPage/adminEntityService/adminService/genre-service.service';
import { SongAuthorService } from './../../adminPage/adminEntityService/adminService/song-author.service';
import { SongGenreService } from './../../adminPage/adminEntityService/adminService/song-genre.service';
import { SongSingerService } from './../../adminPage/adminEntityService/adminService/song-singer.service';
import { AlbumService } from './../../adminPage/adminEntityService/adminService/album/album.service';
import {Component, OnInit, signal} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {UserPlaylistModalComponent} from "../user-playlist-modal/user-playlist-modal.component";
import {SongService} from "../../adminPage/adminEntityService/adminService/song.service";
import {Singer} from "../../adminPage/adminEntityService/adminEntity/singer/singer";
import {Song} from "../../adminPage/adminEntityService/adminEntity/song/song";
import {NgForOf} from "@angular/common";
import { Album } from '../../adminPage/adminEntityService/adminEntity/album/album';
import { ActivatedRoute } from '@angular/router';
import { SingerService } from '../../adminPage/adminEntityService/adminService/singer-service.service';
import { FirebaseStorageCrudService } from '../../../services/firebase-storage-crud.service';
import { Observable, forkJoin, map, startWith, switchMap } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Genre } from '../../adminPage/adminEntityService/adminEntity/genre/genre';
import { Author } from '../../adminPage/adminEntityService/adminEntity/author/author';

@Component({
  selector: 'app-user-playsong',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './user-playsong.component.html',
  styleUrl: './user-playsong.component.scss'
})
export class UserPlaysongComponent implements OnInit {
  songs: Song[] = [];
  id!:any;
  album:Album=new Album();
  song:Song=new Song();
  singers:Singer[]=[];
  genres:Genre[]=[];
  authors:Author[]=[];
  filterOptionsSinger!: Observable<string[]>;
  formcontrol = new FormControl('');
  singerMap: { [key: number]: any[] } = {};
  genreMap: { [key: number]: any[] } = {};
  authorMap: { [key: number]: any[] } = {};
  constructor(private matDialog: MatDialog,
              private SongService: SongService,
              private AlbumService:AlbumService,
              private route: ActivatedRoute,
              private singerService: SingerService,
              private SongSingerService:SongSingerService,
              private SongGenreService:SongGenreService,
              private GenreServiceService:GenreServiceService,
              private AuthorService:AuthorService,
              private SongAuthorService:SongAuthorService,
              private firebaseStorage: FirebaseStorageCrudService
  ) {
  }

  openDialog(songInput: Song) {
    const dialogRef = this.matDialog.open(UserPlaylistModalComponent, {
      // width: '350px',
      data: {song: songInput} // Truyền ID vào data
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getAllSongs();
    this.getAlbumById();

  }

  getAllSongs(): void {
    this.SongService.getAllSongsByAlbumId(this.id).subscribe((data) => {
      this.songs = data;
      console.log("Hehehehehheheheh"+this.songs)
      this.getSingersForSongs();
      this.getGenresForSongs();
      this.getAuthorsForSongs();
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

}
