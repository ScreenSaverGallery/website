import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';


@Component({
  selector: 'ssg-tag-posts',
  templateUrl: './tag-posts.component.html',
  styleUrls: ['./tag-posts.component.scss']
})
export class TagPostsComponent implements OnInit {

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
