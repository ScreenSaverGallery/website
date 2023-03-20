import { Component, OnInit, Input } from '@angular/core';
// services
import { WpService } from '../../services/wp/wp.service';
import { ColorService } from '../../services/color/color.service';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'ssg-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  @Input() set postsOf(value: string) {
    this._postsOf = value;
    // reset
    this.posts = [];
    this.postsPage = 1;
    this.slug = value;
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
  slug: string;
  randomColor: string = 'silver';

  bwTheme: boolean = false;

  constructor(
    private wpService: WpService,
    private colorService: ColorService,
    private themeService: ThemeService
  ) { }

  ngOnInit() {
    this.themeService.bwTheme.subscribe((bw: boolean) => {
      this.bwTheme = bw;
      this.randomColor = (bw ? 'white' : this.colorService.generateHslaColors(100)[0]);
    });

    if (this._postsFrom && this._postsOf) {
      this.loadPosts();
    }
    
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
        } else {
          // sort children
          // console.log('children', this.children);
          // this.children = this.children.sort((a: any, b: any) => parseFloat(a.id) + parseFloat(b.id) );
          // console.log('sorted children', this.children);
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
      if (res) {
        const tag = res;
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
    if (this.total > this.posts.length && this.postsPage < this.totalPages + 1) {
      return true;
    }
    return false;
  }

  loadMorePosts(load: boolean): void {
    if (load && !this.loadingPosts) {
      this.loadPosts();
    }
  }


  log(key: any, value: any): void {
    console.log(key, value);
  }

  

}
