import { Component } from '@angular/core';
import { UserTabPersonalComponent } from '../user-tab-personal/user-tab-personal.component';
import { UserTabExploreComponent } from '../user-tab-explore/user-tab-explore.component';
import { UserTabChartsComponent } from '../user-tab-charts/user-tab-charts.component';
import { UserTabRadioComponent } from '../user-tab-radio/user-tab-radio.component';
import { UserTabFollowingComponent } from '../user-tab-following/user-tab-following.component';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-user-home-component',
  standalone: true,
  templateUrl: './user-home-component.component.html',
  styleUrl: './user-home-component.component.scss',
  imports: [
    UserTabPersonalComponent,
    UserTabExploreComponent,
    UserTabChartsComponent,
    UserTabRadioComponent,
    UserTabFollowingComponent,
    NgOptimizedImage,
  ],
})
export class UserHomeComponentComponent {}
