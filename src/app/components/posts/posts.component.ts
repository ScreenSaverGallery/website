import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
// services
import { WpService } from '../../services/wp/wp.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  category: any;
  posts: any;
  maxVisiblePosts: number = 5;

  constructor(
    private route: ActivatedRoute,
    private wpService: WpService
  ) { }

  ngOnInit() {
    this.wpService.categories.subscribe((res: any) => {
      if (res) {
        // console.log('posts.component categories', res);
        this.route.url.subscribe((url: UrlSegment[]) => {
          // console.log('url', url);
          if (url.length > 0) {
            this.category = this.wpService.getCategoryBySlug(url[1].path);
            // console.log('category', this.category);
            this.posts = [];
            this.getCategoryPosts();
          }
        });
      }
    });
  }

  getCategoryPosts(): void {
    this.wpService.getPostsOfCategory(this.category.id).subscribe((posts: any[]) => {
      // console.log('category posts', posts);
      if (posts && posts.length > 0) this.posts = posts;
    });
  }

  

}
