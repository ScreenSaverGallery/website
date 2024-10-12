import { Component, OnInit, Input } from '@angular/core';
// services
import { WpService } from '../../services/wp/wp.service';
import { ColorService } from '../../services/color/color.service';
import { ThemeService } from '../../services/theme/theme.service';
import { Category, Post, User, Tag } from '@tomaszatoo/ngx-wp-api';
import { HttpResponse } from '@angular/common/http';
// rxjs
import { Subscription } from 'rxjs';

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
    if (!this.loadingPosts) this.loadPosts();
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
  private loadingPosts: boolean = false;

  title: string;
  slug: string;
  randomColor: string = 'silver';

  // bwTheme: boolean = false;

  private getCategoriesSub: Subscription = new Subscription();

  constructor(
    private wpService: WpService,
    private colorService: ColorService
  ) { }

  ngOnInit() {
    this.randomColor = this.colorService.generateHslaColors(100)[0];
    // load posts (page 1)
    if (this._postsFrom && this._postsOf && !this.loadingPosts) {
      this.loadPosts();
    }
    
  }

  private loadPosts(): void {
    // console.log('postsFrom', this._postsFrom);
    if (!this._postsFrom) return; // return if not set from what to load
    // start loading
    this.loadingPosts = true;
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

  /* GET CATEGORY POSTS */
  private getCategoryPosts(categorySlug: string): void {
    this.getCategoriesSub = this.wpService.categories.subscribe((categories: Category[]) => {
      if (categories) {
        // console.log('getCategoryPosts -> categories', categories);
        this.category = this.wpService.getCategoryBySlug(categorySlug);
        this.children = this.wpService.categoryChildren(this.category.id);
        // console.log('getCategoryPosts category', this.category);
        // console.log('getCategoryPosts children', this.children);
        // set title
        this.title = this.category.name;
        // console.log('children', this.children);
        // no children
        if (this.children.length === 0) {
          // this.loadingPosts = true;
          const getCatPostsSub: Subscription = this.wpService.getCategoryPosts(this.category.id, this.postsPage, true).subscribe((res: HttpResponse<any>) => {
            this.recievePosts(res);
            // unsubscribe
            getCatPostsSub.unsubscribe();
          });
        } else {
          console.warn('getCategoryPosts -> children', this.children)
          // sort children
          // console.log('children', this.children);
          // this.children = this.children.sort((a: any, b: any) => parseFloat(a.id) + parseFloat(b.id) );
          // console.log('sorted children', this.children);
        }
        this.getCategoriesSub.unsubscribe();
      }
    });
  }

  /* GET AUTHOR POSTS (not used) */
  private getAuthorPosts(authorSlug: string): void {
    const getUserBySlugSub: Subscription = this.wpService.getUserBySlug(authorSlug).subscribe((user: User) => {
      if (user) {
        const author = user;
        this.title = (author.name === '&amp;' ? '&' : author.name);
        const getPostsByAuthorSub: Subscription = this.wpService.getPostsByAuthor(author.id, this.postsPage).subscribe((r: any) => {
          this.recievePosts(r);
          // unsubscribe
          getPostsByAuthorSub.unsubscribe();
        });
      }
      getUserBySlugSub.unsubscribe();
    });
  }

  /* GET TAG POSTS */
  private getTagPosts(tagSlug: string): void {
    // console.log('getTagPosts', tagSlug);
    const getTagSub: Subscription = this.wpService.getTagBySlug(tagSlug).subscribe((tag: Tag) => {
      if (tag) {
        // const tag = res;
        this.title = tag.name;
        const getPostsSub: Subscription = this.wpService.getPostsByTag(tag.id, this.postsPage, true).subscribe((res: HttpResponse<any>) => {
          this.recievePosts(res);
          getPostsSub.unsubscribe();
        });
        getTagSub.unsubscribe();
      }
    });
    
  }

  /* RECIVE POSTS FROM TAXONOMY */
  private recievePosts(res: HttpResponse<any>): void {
    if (res && res.body && res.body.length > 0) {
      this.loadingPosts = false;
      const temp: any[] = this.posts;
      this.total = Number(res.headers.get('X-WP-Total'));
      this.totalPages = Number(res.headers.get('X-WP-TotalPages'));
      if (this.posts.length < this.total) {
        this.posts = temp.concat(res.body);
      }
      // load more posts
      // console.log('shouldLoadMore?', this.shouldLoadMore());
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
