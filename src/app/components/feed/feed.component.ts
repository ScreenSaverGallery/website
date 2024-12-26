import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
// services
import { FeedService } from 'src/app/services/feed/feed.service';
// rxjs
import { Subscription } from 'rxjs';

@Component({
  selector: 'ssg-feed',
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent implements OnInit, OnDestroy {

  private feedSub: Subscription = new Subscription();

  constructor(
    private elm: ElementRef,
    private feedService: FeedService
  ){}

  ngOnInit(): void {
    this.feedSub = this.feedService.FEED.subscribe({
      next: (feed: string) => {
        if (feed) {
          console.log('feed', feed);
          // this.elm.nativeElement.innerText = feed;
          // const parser = new DOMParser();
          // const xml: XMLDocument = parser.parseFromString(feed, 'text/xml');
          // document.open(feed);
          // document.write(XMLSerializer)
          // document = xmlDoc;
          // document.open();
          // document.write(feed);
          // document.close();
          this.feedSub.unsubscribe();
        }
      },
      error: (e: any) => {
        console.error(e);
        this.feedSub.unsubscribe();
      }
    })
  }

  ngOnDestroy(): void {
    this.feedSub.unsubscribe();
  }
}
