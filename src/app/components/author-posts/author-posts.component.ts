import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
// rxjs
import { Subscription } from 'rxjs';

import { PostsComponent } from '../posts/posts.component';


@Component({
    selector: 'ssg-author-posts',
    templateUrl: './author-posts.component.html',
    styleUrls: ['./author-posts.component.scss'],
    standalone: true,
    imports: [PostsComponent]
})
export class AuthorPostsComponent implements OnInit, OnDestroy {

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
        console.log('postsOf', this.postsOf);
        console.log('postsFrom', this.postsFrom);
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

}
