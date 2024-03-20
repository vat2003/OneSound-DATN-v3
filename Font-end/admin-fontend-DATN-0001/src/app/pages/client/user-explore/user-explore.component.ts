import { GenreServiceService } from './../../adminPage/adminEntityService/adminService/genre-service.service';
import { SingerService } from './../../adminPage/adminEntityService/adminService/singer-service.service';
import { SongGenreService } from './../../adminPage/adminEntityService/adminService/song-genre.service';
import { SongSingerService } from './../../adminPage/adminEntityService/adminService/song-singer.service';
import { SongGenre } from './../../adminPage/adminEntityService/adminEntity/song/songGenre';
import { SongSinger } from './../../adminPage/adminEntityService/adminEntity/song/songSinger';
import { SongService } from './../../adminPage/adminEntityService/adminService/song.service';
import { SongAlbum } from './../../adminPage/adminEntityService/adminEntity/song/songAlbum';
import { AlbumService } from './../../adminPage/adminEntityService/adminService/album/album.service';
import { Component, OnInit } from '@angular/core';
// import { SingerService } from '../../adminPage/adminEntityService/adminService/singer-service.service';
import { Singer } from '../../adminPage/adminEntityService/adminEntity/singer/singer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FirebaseStorageCrudService } from '../../../services/firebase-storage-crud.service';
import { Router } from '@angular/router';
import { StaticticalService } from '../../adminPage/adminEntityService/adminService/statictical/statictical.service';
import { error } from 'console';
import { Album } from '../../adminPage/adminEntityService/adminEntity/album/album';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { Song } from '../../adminPage/adminEntityService/adminEntity/song/song';
import { Genre } from '../../adminPage/adminEntityService/adminEntity/genre/genre';

@Component({
  selector: 'app-user-explore',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-explore.component.html',
  styleUrl: './user-explore.component.scss',
})
export class UserExploreComponent implements OnInit {
  hotArtist: Singer[] = [];
  albums:Album[]=[];
  songs:Song[]=[];
  singers:Singer[]=[];
  genres:Genre[]=[];
  singerMap: { [key: number]: any[] } = {};
  genreMap: { [key: number]: any[] } = {};
  constructor(
    private SingerService: SingerService,
    private AlbumService:AlbumService,
    private firebaseStorage: FirebaseStorageCrudService,
    private router: Router,
    private statisticsService: StaticticalService,
    private SongService:SongService,
    private SongSingerService:SongSingerService,
    private SongGenreService:SongGenreService,
    // private SingerService:SingerService,
    private GenreServiceService:GenreServiceService
  ) { }
  index: number = 0;
  ngOnInit(): void {
    this.getAllSongs();
    this.getAllArtist();
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
  getAllAlbum(): void {
    this.AlbumService.getAllAlbumNormal().subscribe(async (data) => {
      this.albums = data;
      console.log(this.albums);
      console.log(data);
      this.albums = data;

      for (const hotArt of this.albums) {
        if (hotArt.image == null || hotArt.image == '') {
          continue;
        }
        hotArt.image = await this.setImageURLFirebase(hotArt.image);
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
  gotoDetailAlbum(album:Album):void{
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
      this.songs = data;
      console.log(this.albums);
      console.log(data);
      this.songs = data;

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

}
