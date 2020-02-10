import {
  Component,
  OnInit,
  Input
} from '@angular/core';
// services
import { WpService } from '../../services/wp/wp.service';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {

  @Input() id: number;

  url: string;
  mediaType: string;
  title: string;
  imageDetails: any;

  constructor(
    private wpService: WpService
  ) { }

  ngOnInit() {
    if (this.id) {
      this.wpService.getMedia(this.id).subscribe((res: any) => {
        // console.log('media res', res);
        if (res.status === 200 && res.body.source_url) {
          this.mediaType = res.body.media_type;
          this.title = res.body.title.rendered;
          // console.log('title', this.title);
          this.imageDetails = res.body.media_details;
          // console.log('imageDetails', this.imageDetails);

          // should be last
          this.url = res.body.source_url;
        }
      });
    }
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
