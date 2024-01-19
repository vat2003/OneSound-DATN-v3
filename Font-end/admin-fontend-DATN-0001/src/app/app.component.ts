import {Component, OnInit, Renderer2} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavigationEnd, Router, RouterLink, RouterOutlet} from '@angular/router';
import {AdminUserServiceService} from "./services/admin-user-service.service";
import {filter} from "rxjs";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [AdminUserServiceService]
})

export class AppComponent implements OnInit {
  title = 'admin-fontend-DATN-0001';

  constructor(
    private router: Router,
    private adminUserService: AdminUserServiceService,
    private renderer: Renderer2
  ) {

  }

  // app.component.ts
  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const isAdmin = event.url.startsWith('/onesound/admin');
        const isSignin = event.url.startsWith('/onesound/signin');
        const isSignup = event.url.startsWith('/onesound/signup');
        this.adminUserService.setAdminMode(isAdmin);

        // Add or remove stylesheets based on the isAdmin condition
        if (isAdmin || isSignin || isSignup) {
          // Libraries Stylesheet
          this.addStylesheet('assets/lib/owlcarousel/assets/owl.carousel.min.css');
          this.addStylesheet('assets/lib/tempusdominus/css/tempusdominus-bootstrap-4.min.css');

          // Customized Bootstrap Stylesheet
          this.addStylesheet('assets/css/bootstrap.min.css');

          // Template Stylesheet
          this.addStylesheet('assets/css/style.css');

          //JavaScript Libraries
          this.addScript('https://code.jquery.com/jquery-3.4.1.min.js');
          this.addScript('https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js');
          this.addScript('assets/lib/chart/chart.min.js');
          this.addScript('assets/lib/easing/easing.min.js');
          this.addScript('assets/lib/waypoints/waypoints.min.js');
          this.addScript('assets/lib/owlcarousel/owl.carousel.min.js');
          this.addScript('assets/lib/tempusdominus/js/moment.min.js');
          this.addScript('assets/lib/tempusdominus/js/moment-timezone.min.js');
          this.addScript('assets/lib/tempusdominus/js/tempusdominus-bootstrap-4.min.js');
          this.addScript('assets/js/main.js');
          this.addScript('assets/js/uploadfile.js');

        } else {
          // Libraries Stylesheet
          this.removeStylesheet('assets/lib/owlcarousel/assets/owl.carousel.min.css');
          this.removeStylesheet('assets/lib/tempusdominus/css/tempusdominus-bootstrap-4.min.css');

          // Customized Bootstrap Stylesheet
          this.removeStylesheet('assets/css/bootstrap.min.css');

          // Template Stylesheet
          this.removeStylesheet('assets/css/style.css');

          //JavaScript Libraries
          this.removeScript('https://code.jquery.com/jquery-3.4.1.min.js');
          this.removeScript('https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js');
          this.removeScript('assets/lib/chart/chart.min.js');
          this.removeScript('assets/lib/easing/easing.min.js');
          this.removeScript('assets/lib/waypoints/waypoints.min.js');
          this.removeScript('assets/lib/owlcarousel/owl.carousel.min.js');
          this.removeScript('assets/lib/tempusdominus/js/moment.min.js');
          this.removeScript('assets/lib/tempusdominus/js/moment-timezone.min.js');
          this.removeScript('assets/lib/tempusdominus/js/tempusdominus-bootstrap-4.min.js');
          this.removeScript('assets/js/main.js');
          this.removeScript('assets/js/uploadfile.js');
        }
      }
    });

  }

  private addStylesheet(href: string): void {
    if (typeof document !== 'undefined' && !this.isStylesheetPresent(href)) {
      const link = this.renderer.createElement('link');
      this.renderer.setAttribute(link, 'href', href);
      this.renderer.setAttribute(link, 'rel', 'stylesheet');
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
      const existingScript = document.body.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        this.renderer.removeChild(document.body, existingScript);
      }
    }
  }


}
