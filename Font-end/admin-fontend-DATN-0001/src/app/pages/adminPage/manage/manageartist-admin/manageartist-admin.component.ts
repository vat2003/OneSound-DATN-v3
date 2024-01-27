import { CommonModule } from '@angular/common';
import {Component} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Singer } from '../../adminEntityService/adminEntity/singer/singer';
import { SingerService } from '../../adminEntityService/adminService/singer-service.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-manageartist-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],

  templateUrl: './manageartist-admin.component.html',
  styleUrl: './manageartist-admin.component.scss'
})
export class ManageartistAdminComponent {
  id!: number;
  singers: Singer[] = [];
  singer: Singer = new Singer();


  constructor(
    private singerService: SingerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.loadSingerById();
    this.loadSingers();
  }

  private loadSingers() {
    this.singerService.getCategories(0, 10).subscribe(
      (data) => {
        console.log(data);
        this.singers = data.content;
      },
      (error) => console.log(error)
    );
  }

  private loadSingerById() {
    this.singerService.getEmployeeById(this.id).subscribe(
      (data) => {
        this.singer = data;
      },
      (error) => console.log(error)
    );
  }

  updateSinger(id: number) {
    this.router.navigate(['update-singer', id]);
  }

  deleteSinger(id: number) {
    const isConfirmed = window.confirm('Are you sure you want to delete this singer?');
    if (isConfirmed) {
      this.singerService.deleteEmployee(id).subscribe((data) => {
        console.log(data);
        this.loadSingers();
      });
    }
  }

  saveSinger() {
    this.singerService.createEmployee(this.singer).subscribe(
      (data) => {
        console.log(data);
      },
      (error) => console.log(error)
    );
  }

  goToSingerList() {
    this.loadSingers();
    this.router.navigate(['/manage/artist']);
  }

  onSubmit() {
    this.saveSinger();
    this.goToSingerList();
    this.singerService.updateEmployee(this.id, this.singer).subscribe(
      (data) => {
        this.goToSingerList();
      },
      (error) => console.log(error)
    );
  }
}
