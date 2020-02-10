import { Component, OnInit, Input } from '@angular/core';
// services
import { WpService } from '../../services/wp/wp.service';
import { ColorService } from '../../services/color/color.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  @Input() set postsOf(value: string) {
    this._postsOf = value;
    // reset
    this.posts = [];
    this.postsPage = 1;
    this.loadPosts();
  };
  @Input() set postsFrom(value: string) {
    this._postsFrom = value;
  };

  private _postsOf: string;
  private _postsFrom: string;

  category: any;
  children: any[] = [];
  posts: any[] = [];
  maxVisiblePosts: number = 30;
  postsPage: number = 1;
  total: number;
  totalPages: number;
  loadingPosts: boolean = false;

  title: string;
  randomColor: string = 'silver';

  constructor(
    private wpService: WpService,
    private colorService: ColorService
  ) { }

  ngOnInit() {
    if (this._postsFrom && this._postsOf) {
      this.loadPosts();
    }
    this.randomColor = this._getRandomColor();
  }

  private loadPosts(): void {
    // console.log('postsFrom', this._postsFrom);
    switch (this._postsFrom) {
      case 'archive':
        this.getCategoryPosts(this._postsOf);
        break;
      case 'tag':
        this.getTagPosts(this._postsOf);
        break;
      case 'author':
        this.getAuthorPosts(this._postsOf);
        break;
    }
  }

  getCategoryPosts(categorySlug: string): void {
    this.wpService.categories.subscribe((res: any) => {
      if (res) {
        this.category = this.wpService.getCategoryBySlug(categorySlug);
        this.children = this.wpService.categoryChildren(this.category.id);
        // set title
        this.title = this.category.name;
        // console.log('children', this.children);
        if (this.children.length === 0) {
          this.loadingPosts = true;
          this.wpService.getCategoryPosts(this.category.id, this.postsPage).subscribe((res: any) => {
            this.recievePosts(res);
          });
        }
      }
    });
  }

  getAuthorPosts(authorSlug: string): void {
    this.wpService.getUserBySlug(authorSlug).subscribe((res: any) => {
      if (res) {
        const author = res;
        this.title = (author.name === '&amp;' ? '&' : author.name);
        this.wpService.getPostsByAuthor(author.id, this.postsPage).subscribe((r: any) => {
          this.recievePosts(r);
        });
      }
    });
  }

  getTagPosts(tagSlug: string): void {
    this.wpService.getTagBySlug(tagSlug).subscribe((res: any) => {
      if (res.status === 200) {
        // console.log('getTagBySlug', res);
        const tag = res.body[0];
        // console.log('tag', tag);
        this.title = tag.name;
        this.wpService.getPostsByTag(tag.id, this.postsPage).subscribe((r: any) => {
          this.recievePosts(r);
        });
      }
    });
    
  }

  private recievePosts(res: any): void {
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
    }
  }

  shouldLoadMore(): boolean {
    // console.log('shouldLoadMore', this.total > this.posts.length && this.postsPage < this.totalPages + 1);
    if (this.total > this.posts.length && this.postsPage < this.totalPages + 1) {
      return true;
    }
    return false;
  }

  loadMorePosts(load: boolean): void {
    // console.log('loadMorePosts', load);
    if (load && !this.loadingPosts) {
      this.loadPosts();
    }
  }

  private _getRandomColor(): string {
    const color: string = this.colorService.generateHslaColor(100);
    console.log(color);
    return color;
  }

  log(key: any, value: any): void {
    console.log(key, value);
  }

  

}
