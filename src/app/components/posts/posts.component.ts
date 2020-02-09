import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
// services
import { WpService } from '../../services/wp/wp.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  category: any;
  children: any[] = [];
  posts: any[] = [];
  maxVisiblePosts: number = 30;
  postsPage: number = 1;
  total: number;
  totalPages: number;
  loadingPosts: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private wpService: WpService
  ) { }

  ngOnInit() {
    // console.log('init posts.component');
    // TODO TAGS, YEAR ARCHIVES
    this.wpService.categories.subscribe((res: any) => {
      if (res) {
        this.route.url.subscribe((url: UrlSegment[]) => {
          // console.log('url', url);
          this.postsPage = 1; // reset
          if (url.length > 0) {
            const lastUrlPath: number = url.length - 1;
            this.category = this.wpService.getCategoryBySlug(url[lastUrlPath].path);
            this.children = this.wpService.categoryChildren(this.category.id);
            this.posts = []; // reset
            if (this.children.length === 0) {
              this.getCategoryPosts();
            }
          }
        });
      }
    });
  }

  getCategoryPosts(): void {
    this.loadingPosts = true;
    this.wpService.getCategoryPosts(this.category.id, this.postsPage).subscribe((res: HttpResponse<any>) => {
      if (res && res.body && res.body.length > 0) {
        this.loadingPosts = false;
        const temp: any[] = this.posts;
        this.total = Number(res.headers.get('X-WP-Total'));
        this.totalPages = Number(res.headers.get('X-WP-TotalPages'));
        if (this.posts.length < this.total) {
          this.posts = temp.concat(res.body);
        }
        // load more posts
        if (this.shouldLoadMore()) {
          this.postsPage++;
        } 
      };
    });
  }

  shouldLoadMore(): boolean {
    if (this.total > this.posts.length && this.postsPage < this.totalPages + 1) {
      return true;
    }
    return false;
  }

  loadMorePosts(load: boolean): void {
    if (load && !this.loadingPosts) {
      this.getCategoryPosts();
    }
  }

  log(key: any, value: any): void {
    console.log(key, value);
  }

  

}
