import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
// import { RecaptchaModule } from 'ng-recaptcha';
// import { NgxCaptchaModule } from 'ngx-captcha';

@Component({
  selector: 'app-captcha',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // NgxCaptchaModule,
    // RecaptchaModule
  ],
  templateUrl: './captcha.component.html',
  styleUrl: './captcha.component.scss'
})
export class CaptchaComponent {
  protected aFormGroup!: FormGroup;


  constructor(private formBuilder: FormBuilder) {
  }


  ngOnInit(): void {
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });

  }
}
