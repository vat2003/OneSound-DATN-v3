import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Genre} from "../../adminEntityService/adminEntity/genre/genre";
import {GenreServiceService} from "../../adminEntityService/adminService/genre-service.service";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-managegenre-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,],
  templateUrl: './managegenre-admin.component.html',
  styleUrl: './managegenre-admin.component.scss'
})
export class ManagegenreAdminComponent implements OnInit{
  id!: number;
  Genre: Genre[] = [];
  Genree: Genre = new Genre();
  constructor(
    private GenreService: GenreServiceService,
    private router: Router,
    private route: ActivatedRoute

  ){
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getEmployees();
    this.loadSingerById();

  }
  private loadSingerById() {
    this.GenreService.getGenre(this.id).subscribe(
      (data) => {
        this.Genree = data;
      },
      (error) => console.log(error)
    );
  }

  private getEmployees(){
    this.GenreService.getCategories(0,10).subscribe(data => {
      console.log(data);
      this.Genre = data.content;
    });
  }

  goToSingerList() {
    this.getEmployees();
    this.router.navigate(['/manage/genre']);
  }

  saveGenre() {
    this.GenreService.createGenre(this.Genree).subscribe(
      (data) => {
        console.log(data);
      },
      (error) => console.log(error)
    );
  }

  updateGender(id: number) {
    this.router.navigate(['update-genre', id]);
  }

  deleteGender(id: number) {
    const isConfirmed = window.confirm('Are you sure you want to delete this singer?');
    if (isConfirmed) {
      this.GenreService.deleteGenre(id).subscribe((data) => {
        console.log(data);
        this.getEmployees();
      });
    }
  }


  onSubmit() {
    this.saveGenre();
    this.goToSingerList();
    this.GenreService.updateGenre(this.id, this.Genree).subscribe(
      (data) => {
        this.goToSingerList();
      },
      (error) => console.log(error)
    );
  }


}
