import { Component } from '@angular/core';
import { UserPlayermusicComponent } from '../user-playermusic/user-playermusic.component';
import { UserExploreComponent } from '../user-explore/user-explore.component';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-menuside',
  standalone: true,
  templateUrl: './user-menuside.component.html',
  styleUrl: './user-menuside.component.scss',
  imports: [
    UserPlayermusicComponent,
    UserExploreComponent,
    RouterLink,
    RouterOutlet,
  ],
})
export class UserMenusideComponent {}
