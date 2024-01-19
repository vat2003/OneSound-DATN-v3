import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {

}
