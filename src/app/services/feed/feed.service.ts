import { Injectable } from '@angular/core';
// http 
import { HttpClient } from '@angular/common/http';
// rxjs
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedService {

  private FEED_URL: string = 'https://screensaver.metazoa.org/feed/';
  FEED: BehaviorSubject<string> = new BehaviorSubject('');

  constructor(
    private http: HttpClient
  ) {}

  getFeed(): void {
    const getFeedSub = this.http.get(this.FEED_URL, { responseType: 'text'}).subscribe({
      next: (feed: string) => {
        if (feed) this.FEED.next(feed.replace(this.FEED_URL, 'https://screensaver.gallery/feed/'));
        getFeedSub.unsubscribe();
      },
      error: (e: any) => {
        console.error(e);
        getFeedSub.unsubscribe();
      }
    });
  }
}
