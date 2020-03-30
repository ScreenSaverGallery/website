import {
  Component,
  OnInit,
  Input,
  Output
} from '@angular/core';
// models
import { SocialMedium } from '../../models/social-medium';



@Component({
  selector: 'ssg-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})
export class SocialComponent implements OnInit {

  @Input() medias: SocialMedium[] = []; // no medias default ;)
  @Input() referenceUrl: string;
  @Input() share: boolean = true;

  constructor() { }

  ngOnInit(): void {
    // console.log('share', this.share);
    // console.log('medias', this.medias);
    // console.log('referenceUrl', this.referenceUrl);
  }

  getHref(): string {
    if (this.referenceUrl) return this.referenceUrl;
    return window.location.href;
  }

  openHref(href: string): void {
    window.open(href, '_blank');
  }

}
