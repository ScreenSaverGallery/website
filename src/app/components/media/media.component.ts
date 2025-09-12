import {
  Component,
  OnInit,
  OnDestroy,
  Input
} from '@angular/core';
// services
import { WpService } from '../../services/wp/wp.service';
// interfaces
import { Media } from '@tomaszatoo/ngx-wp-api';
// rxjs
import { Subscription } from 'rxjs';

// interface MediaExtended extends Media {
//   media_details: { width: number, height: number, sizes: any }
// }

@Component({
    selector: 'ssg-media',
    templateUrl: './media.component.html',
    styleUrls: ['./media.component.scss'],
    standalone: true
})
export class MediaComponent implements OnInit, OnDestroy {

  @Input() id: number;

  url: string;
  mediaType: string;
  title: string;
  imageDetails: any;

  private getMediaSub: Subscription = new Subscription();

  constructor(
    private wpService: WpService
  ) { }

  ngOnInit() {
    if (this.id) {
      this.getMediaSub = this.wpService.getMedia(this.id).subscribe((media: Media) => {
        // console.log('media res', res);
        if (media && media.source_url) {
          this.mediaType = media.media_type;
          this.title = media.title.rendered;
          // console.log('title', this.title);
          this.imageDetails = media.media_details;
          // console.log('imageDetails', this.imageDetails);
          // should be last
          this.url = media.source_url;
          this.getMediaSub.unsubscribe();
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.getMediaSub.unsubscribe();
  }

  getImageSrcset(): string {
    let set: string = '';
    for (let s in this.imageDetails.sizes) {
      // console.log(s, this.imageDetails.sizes[s]);
      const size: any = this.imageDetails.sizes[s];
      set += (s !== 'full' ? `${size.source_url} ${size.width}w, ` : `${size.source_url} ${size.width}w`);
    }
    return set;
  }

  getImageSrcSizes(): string {
    let sizes: string = `(max-width: ${this.imageDetails.sizes.full.width}px) 100vw, ${this.imageDetails.sizes.full.width}px`;
    return sizes;
  }

}
