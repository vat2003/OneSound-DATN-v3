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
        const isAdmin = event.url.includes('admin');
        const isUserClient = event.url.includes('onesound');
        this.adminUserService.setAdminMode(isAdmin);

        // Add or remove stylesheets based on the isAdmin condition
        if (isAdmin) {
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

  private addUserStyle(): void {
    this.addStylesheet('https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css');
    this.addStylesheet('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css');
    this.addStylesheet('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap');
    this.addStylesheet('assets/css/grid.css');
    this.addStylesheet('assets/css/base.css');
    this.addStylesheet('assets/css/main.css');
    this.addStylesheet('assets/css/responsive.css');
  }

  private addUserScript(): void {
    this.addScript('assets/data/themes.js');
    this.addScript('assets/data/listThemes.js');
    this.addScript('assets/data/songPlaylists.js');
    this.addScript('assets/data/playlists.js');
    this.addScript('assets/data/albums.js');
    this.addScript('assets/data/mvs.js');
    this.addScript('assets/data/artists.js');
    this.addScript('assets/data/tabExplore/exploreSlides.js');
    this.addScript('assets/data/tabExplore/radios.js');
    this.addScript('assets/data/tabExplore/labels.js');
    this.addScript('assets/data/tabExplore/singerSlides.js');
    this.addScript('assets/data/tabExplore/events.js');
    this.addScript('assets/data/tabExplore/newPlaylists.js');
    this.addScript('assets/data/tabExplore/favArtists.js');
    // this.addScript('assets/data/tabExplore/brands.js');
    this.addScript('assets/data/specialPlaylists.js');
    this.addScript('assets/data/normalPlaylists.js');
    this.addScript('assets/data/tabCharts/playlistCharts.js');
    this.addScript('assets/data/tabFollowing/posts.js');
    this.addScript('assets/data/toast.js');
    this.addScript('assets/data/main.js');

  }

  private addAdminStyle(): void {
    // Libraries Stylesheet
    this.addStylesheet('assets/lib/owlcarousel/assets/owl.carousel.min.css');
    this.addStylesheet('assets/lib/tempusdominus/css/tempusdominus-bootstrap-4.min.css');

    // Customized Bootstrap Stylesheet
    this.addStylesheet('assets/css/bootstrap.min.css');

    // Template Stylesheet
    this.addStylesheet('assets/css/style.css');
  }

  private addAdminScript(): void {
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
  }


  private removeUserStyle(): void {
    this.removeStylesheet('https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css');
    this.removeStylesheet('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css');
    this.removeStylesheet('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap');
    this.removeStylesheet('assets/css/grid.css');
    this.removeStylesheet('assets/css/base.css');
    this.removeStylesheet('assets/css/main.css');
    this.removeStylesheet('assets/css/responsive.css');
  }

  private removeUserScript(): void {
    this.removeScript('assets/data/themes.js');
    this.removeScript('assets/data/listThemes.js');
    this.removeScript('assets/data/songPlaylists.js');
    this.removeScript('assets/data/playlists.js');
    this.removeScript('assets/data/albums.js');
    this.removeScript('assets/data/mvs.js');
    this.removeScript('assets/data/artists.js');
    this.removeScript('assets/data/tabExplore/exploreSlides.js');
    this.removeScript('assets/data/tabExplore/radios.js');
    this.removeScript('assets/data/tabExplore/labels.js');
    this.removeScript('assets/data/tabExplore/singerSlides.js');
    this.removeScript('assets/data/tabExplore/events.js');
    this.removeScript('assets/data/tabExplore/newPlaylists.js');
    this.removeScript('assets/data/tabExplore/favArtists.js');
    // this.removeScript('assets/data/tabExplore/brands.js');
    this.removeScript('assets/data/specialPlaylists.js');
    this.removeScript('assets/data/normalPlaylists.js');
    this.removeScript('assets/data/tabCharts/playlistCharts.js');
    this.removeScript('assets/data/tabFollowing/posts.js');
    this.removeScript('assets/data/toast.js');
    this.removeScript('assets/data/main.js');

  }

  private removeAdminStyle(): void {
    // Libraries Stylesheet
    this.removeStylesheet('assets/lib/owlcarousel/assets/owl.carousel.min.css');
    this.removeStylesheet('assets/lib/tempusdominus/css/tempusdominus-bootstrap-4.min.css');

    // Customized Bootstrap Stylesheet
    this.removeStylesheet('assets/css/bootstrap.min.css');

    // Template Stylesheet
    this.removeStylesheet('assets/css/style.css');
  }

  private removeAdminScript(): void {
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
