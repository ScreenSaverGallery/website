import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
// rxjs
import { Subscription } from 'rxjs';

@Component({
  selector: 'ssg-category-posts',
  templateUrl: './category-posts.component.html',
  styleUrls: ['./category-posts.component.scss']
})
export class CategoryPostsComponent implements OnInit, OnDestroy {

  postsOf: string;
  postsFrom: string;

  private routeSub: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.routeSub = this.route.url.subscribe((url: UrlSegment[]) => {
      if (url.length > 0) {
        // console.log('url', url);
        const lastUrlIndex: number = url.length - 1;
        this.postsOf = url[lastUrlIndex].path;
        this.postsFrom = url[0].path;
      }
    });
  }
  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

}
