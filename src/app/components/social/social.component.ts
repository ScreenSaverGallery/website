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
  @Input() sponsor: boolean = false;

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

  openHref(base: string, href: string): void {
    if (!base) { // if base === undefined, it is Mastodon :/ not wel figured
      let instance: string = '';
      if (localStorage.getItem('mastodon-instance')) {
        instance = localStorage.getItem('mastodon-instance');
      } else {
        instance = window.prompt(
          'Please tell me your Mastodon instance'
        );
        if (instance) localStorage.setItem('mastodon-instance', instance);
      }
      if (instance) {
        window.open(`https://${instance}/share?text=${encodeURIComponent(href)}`, '_blank');
      }
      return;
    }
    // otherwise
    window.open(`${base}${href}`, '_blank');
  }

}
