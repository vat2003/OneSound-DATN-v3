import {Component, Inject, Input, NO_ERRORS_SCHEMA} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Router} from '@angular/router';

@Component({
  selector: 'app-share-social',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './share-social.component.html',
  styleUrl: './share-social.component.scss',
  schemas: [NO_ERRORS_SCHEMA]
})
export class ShareSocialComponent {
  link: any;
  @Input() shareUrl!: string;
  // @Input() type!: 'facebook' | 'twitter';
  navUrl!: string;
  type!: string;
  linkShared!: string;
  routes: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { data: string }, router: Router) {
    this.linkShared = data.data;
    this.routes = router;
  }

  ngOnInit() {
    this.createNavigationUrl();
  }

  private createNavigationUrl() {
    let searchParams = new URLSearchParams();
    // let x = 'https://www.youtube.com/watch?v=zEWSSod0zTY&list=RDsyt0aVSEL7E&index=2';
    let x = window.location.href + '';
    this.shareUrl = x;
//Facebook thường không cho phép chia sẻ liên kết trực tiếp đến các địa chỉ IP cục bộ như localhost hoặc các địa chỉ IP khác
    switch (this.type) {
      case 'facebook':
        searchParams.set('u', this.shareUrl);
        this.navUrl = 'https://www.facebook.com/sharer/sharer.php?' + searchParams;
        console.log(this.navUrl)
        break;
      case 'twitter':
        searchParams.set('url', this.shareUrl);
        this.navUrl = 'https://twitter.com/share?' + searchParams;
        console.log(this.navUrl)
        break;
      case 'linkedin':
        // searchParams.set('url', this.shareUrl);
        // this.navUrl = 'https://www.linkedin.com/shareArticle?mini=true&' + searchParams;
        // console.log(this.navUrl)

        searchParams.set('url', this.shareUrl);
        searchParams.set('title', 'Tiêu đề bài viết'); // Thay bằng tiêu đề của nội dung bạn muốn chia sẻ
        searchParams.set('summary', 'Tóm tắt bài viết'); // Thay bằng tóm tắt nội dung bạn muốn chia sẻ
        searchParams.set('source', 'Tên nguồn'); // Thay bằng tên của nguồn nội dung bạn muốn chia sẻ
        this.navUrl = 'https://www.linkedin.com/sharing/share-offsite/?' + searchParams;
        console.log(this.navUrl)
        break;
    }

  }

  public share(link: string) {
    console.log(link)
    this.type = link;
    this.createNavigationUrl();
    return window.open(this.navUrl, "_blank");
  }


}
