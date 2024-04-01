import {NgToastModule, NgToastService} from 'ng-angular-popup';
import {Component, OnInit, Renderer2} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import {AdminUserServiceService} from './services/admin-user-service.service';
import {filter} from 'rxjs';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
  SocialAuthService
} from 'angularx-social-login';
import {BrowserModule} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    NgToastModule,
    HttpClientModule,
    // HeaderComponent,

  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [AdminUserServiceService, NgToastService,

  ],

})
export class AppComponent implements OnInit {
  title = 'admin-fontend-DATN-0001';

  constructor(
    private router: Router,
    private adminUserService: AdminUserServiceService,
    private renderer: Renderer2,
    private toast: NgToastService
  ) {
  }

  // app.component.ts
  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          const isAdmin = event.url.includes('admin');
          const isUserClient = event.url.includes('onesound');
          const signin = event.url.includes('signin');
          const signup = event.url.includes('signup');
          const forgotpass = event.url.includes('forgotpassword');
          const changepass = event.url.includes('changepassword');
          // const userProfile = event.url.includes('home/profile');
          const userProfile = event.url.includes('profile');
          const userFeedback = event.url.includes('feedback');
          this.adminUserService.setAdminMode(isAdmin);

          if (userProfile) {
            //Remove USER-CLIENT Css StyleSheet Libraries
            this.removeUserStyle();
            //Remove USER-CLIENT JavaScript Libraries
            this.removeUserScript();

            //Remove ADMIN Css StyleSheet Libraries
            this.removeAdminStyle();
            //Remove ADMIN JavaScript Libraries
            this.removeAdminScript();

            this.addProfileStyle();
          }

          if (userFeedback) {
            //Remove USER-CLIENT Css StyleSheet Libraries
            this.removeUserStyle();
            //Remove USER-CLIENT JavaScript Libraries
            this.removeUserScript();

            //Remove ADMIN Css StyleSheet Libraries
            this.removeAdminStyle();
            //Remove ADMIN JavaScript Libraries
            this.removeAdminScript();

            this.removeProfile();

            this.addFeebackStyle();
            this.addFeebackScript()

          }

          // Add or remove stylesheets based on the isAdmin condition
          if (isAdmin || signin || signup || forgotpass || changepass) {
            //Remove USER-CLIENT Css StyleSheet Libraries
            this.removeUserStyle();
            //Remove USER-CLIENT JavaScript Libraries
            this.removeUserScript();

            //Add ADMIN Css StyleSheet Libraries
            this.addAdminStyle();
            //Add ADMIN JavaScript Libraries
            this.addAdminScript();
          } else if (isUserClient && !isAdmin) {
            //Remove ADMIN Css StyleSheet Libraries
            this.removeAdminStyle();
            //Remove ADMIN JavaScript Libraries
            this.removeAdminScript();

            //Add USER-CLIENT Css StyleSheet Libraries
            this.addUserStyle();
            //Add USER-CLIENT JavaScript Libraries
            this.addUserScript();
          }
        }
      });
  }

  private removeProfile(): void {
    this.removeStylesheet('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css');
    this.removeStylesheet('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    this.removeStylesheet('https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css');
    this.removeStylesheet('assets/css/profile.css');
  }

  private addFeebackStyle(): void {

    this.addStylesheet('https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css');
    this.addStylesheet('https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css');
    this.addStylesheet('https://fonts.googleapis.com/css2?family=Pacifico&amp;family=Quicksand&amp;display=swap');
    this.addStylesheet('assets/css/feedbackstyle.scss');
  }

  private addProfileStyle(): void {
    this.addStylesheet('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css');
    this.addStylesheet('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');
    this.addStylesheet('https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css');
    this.addStylesheet('assets/css/profile.css');
  }

  private addUserStyle(): void {
    //xoá đi vẫn chạy đc ??:D?
    this.addPreconnect('https://fonts.googleapis.com');
    this.addPreconnect('https://fonts.gstatic.com');
    this.addStylesheet(
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap'
    );
    this.addStylesheet(
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    );
    // ------------------------------

    this.addStylesheet('assets/css/client/styleplayer.css');
  }

  private addUserScript(): void {
    this.addScript('assets/js/playermusic.js');

    // this.addScript('assets/data/themes.js');
  }

  private addAdminStyle(): void {
    // Libraries Stylesheet
    this.addStylesheet('assets/lib/owlcarousel/assets/owl.carousel.min.css');
    this.addStylesheet(
      'assets/lib/tempusdominus/css/tempusdominus-bootstrap-4.min.css'
    );

    // Customized Bootstrap Stylesheet
    this.addStylesheet('assets/css/bootstrap.min.css');

    // Template Stylesheet
    this.addStylesheet('assets/css/style.css');
  }

  private addAdminScript(): void {
    //JavaScript Libraries
    this.addScript('https://code.jquery.com/jquery-3.4.1.min.js');
    this.addScript(
      'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js'
    );
    this.addScript('assets/lib/chart/chart.min.js');
    this.addScript('assets/lib/easing/easing.min.js');
    this.addScript('assets/lib/waypoints/waypoints.min.js');
    this.addScript('assets/lib/owlcarousel/owl.carousel.min.js');
    this.addScript('assets/lib/tempusdominus/js/moment.min.js');
    this.addScript('assets/lib/tempusdominus/js/moment-timezone.min.js');
    this.addScript(
      'assets/lib/tempusdominus/js/tempusdominus-bootstrap-4.min.js'
    );
    this.addScript('assets/js/main.js');
    this.addScript('assets/js/uploadfile.js');
  }

  private removeUserStyle(): void {
  }

  private removeUserScript(): void {
    this.removeScript('assets/js/playermusic.js');
  }

  private removeProfileStyle(): void {
    this.removeStylesheet('assets/css/profile.css');
  }

  private removeAdminStyle(): void {
    // Libraries Stylesheet
    this.removeStylesheet('assets/lib/owlcarousel/assets/owl.carousel.min.css');
    this.removeStylesheet(
      'assets/lib/tempusdominus/css/tempusdominus-bootstrap-4.min.css'
    );

    // Customized Bootstrap Stylesheet
    this.removeStylesheet('assets/css/bootstrap.min.css');

    // Template Stylesheet
    this.removeStylesheet('assets/css/style.css');
  }

  private removeAdminScript(): void {
    //JavaScript Libraries
    this.removeScript('https://code.jquery.com/jquery-3.4.1.min.js');
    this.removeScript(
      'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js'
    );
    this.removeScript('assets/lib/chart/chart.min.js');
    this.removeScript('assets/lib/easing/easing.min.js');
    this.removeScript('assets/lib/waypoints/waypoints.min.js');
    this.removeScript('assets/lib/owlcarousel/owl.carousel.min.js');
    this.removeScript('assets/lib/tempusdominus/js/moment.min.js');
    this.removeScript('assets/lib/tempusdominus/js/moment-timezone.min.js');
    this.removeScript(
      'assets/lib/tempusdominus/js/tempusdominus-bootstrap-4.min.js'
    );
    this.removeScript('assets/js/main.js');
    this.removeScript('assets/js/uploadfile.js');
  }

  private addStylesheet(href: string): void {
    if (typeof document !== 'undefined' && !this.isStylesheetPresent(href)) {
      const link = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'href', href);
      this.renderer.setAttribute(link, 'rel', 'stylesheet');
      this.renderer.appendChild(document.head, link);
    }
  }

  private addPreconnect(href: string): void {
    if (typeof document !== 'undefined' && !this.isStylesheetPresent(href)) {
      const link = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'href', href);
      this.renderer.setAttribute(link, 'rel', 'preconnect');
      this.renderer.appendChild(document.head, link);
    }
  }

  private isStylesheetPresent(href: string): boolean {
    if (typeof document !== 'undefined') {
      return document.head.querySelector(`link[href="${href}"]`) !== null;
    }
    return false;
  }

  private isScriptPresent(src: string): boolean {
    if (typeof document !== 'undefined') {
      return document.body.querySelector(`script[src="${src}"]`) !== null;
    }
    return false;
  }

  private removeStylesheet(href: string): void {
    if (typeof document !== 'undefined') {
      const existingLink = document.head.querySelector(`link[href="${href}"]`);
      if (existingLink) {
        this.renderer.removeChild(document.head, existingLink);
      }
    }
  }

  private addScript(src: string): void {
    if (typeof document !== 'undefined' && !this.isScriptPresent(src)) {
      const script = this.renderer.createElement('script');
      this.renderer.setAttribute(script, 'src', src);
      this.renderer.appendChild(document.body, script);
    }
  }

  private removeScript(src: string): void {
    if (typeof document !== 'undefined') {
      const existingScript = document.body.querySelector(
        `script[src="${src}"]`
      );
      if (existingScript) {
        this.renderer.removeChild(document.body, existingScript);
      }
    }
  }

  private addFeebackScript() {
    this.addScript('https://code.jquery.com/jquery-3.3.1.slim.min.js');
    this.addScript('https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js');
    this.addScript('https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js');
    this.addScript('https://unpkg.com/feather-icons');
  }
}
