import {
  Component,
  OnInit,
  Input,
  Output
} from '@angular/core';

interface Medium {
  name: string,
  shortcut: string,
  urlBase: string
}

@Component({
  selector: 'ssg-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})
export class SocialComponent implements OnInit {

  @Input() medias: Medium[] = []; // no medias default ;)
  @Input() referenceUrl: string;

  constructor() { }

  ngOnInit(): void {
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
