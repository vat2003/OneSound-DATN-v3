import {Component, Inject, NO_ERRORS_SCHEMA} from '@angular/core';
import {ShareButtonsModule} from "ngx-sharebuttons/buttons";
import {ShareIconsModule} from "ngx-sharebuttons/icons";
import {FaIconLibrary, FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faFastForward} from "@fortawesome/free-solid-svg-icons";
// import { all } from '@fortawesome/free-brands-svg-icons'; // Entire pack
import {faFacebook, faTwitter, faInstagram} from '@fortawesome/free-brands-svg-icons';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-share-social',
  standalone: true,
  imports: [
    ShareButtonsModule,
    ShareIconsModule,
    FontAwesomeModule,
  ],
  templateUrl: './share-social.component.html',
  styleUrl: './share-social.component.scss',
  schemas: [NO_ERRORS_SCHEMA]
})
export class ShareSocialComponent {
  faFastForwards: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { data: string }, library: FaIconLibrary) {
    // this.faFastForwards = faFastForward.icon;
    // library.addIconPacks(faFastForward.icon);
    library.addIcons(faFacebook, faTwitter, faInstagram); // Add individual icons
    // OR
    // library.addIconPacks(all); // Add the entire pack (might be overkill)

  }

}
