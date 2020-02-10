import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';

@Component({
  selector: 'app-category-posts',
  templateUrl: './category-posts.component.html',
  styleUrls: ['./category-posts.component.scss']
})
export class CategoryPostsComponent implements OnInit {

  postsOf: string;
  postsFrom: string;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.url.subscribe((url: UrlSegment[]) => {
      if (url.length > 0) {
        // console.log('url', url);
        const lastUrlIndex: number = url.length - 1;
        this.postsOf = url[lastUrlIndex].path;
        this.postsFrom = url[0].path;
      }
    });
  }

}
