import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-quenmk',
  styleUrls: ['./quenmk.component.scss'],
  templateUrl: './quenmk.component.html',
  standalone: true,
  imports: [
    FormsModule,
  ],
})
export class QuenmkComponent {
  @ViewChild('loginForm') loginForm!: NgForm;
  email: string = '';

  Quenmk() {
    alert(this.email);
  }
}
