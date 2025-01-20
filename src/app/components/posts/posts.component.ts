import { Component, OnInit, OnDestroy, Input } from '@angular/core';
// router
import { ActivatedRoute, UrlSegment } from '@angular/router';
// services
import { WpService } from '../../services/wp/wp.service';
import { ColorService } from '../../services/color/color.service';
import { Category, Post, User, Tag } from '@tomaszatoo/ngx-wp-api';
import { HttpResponse } from '@angular/common/http';
// rxjs
import { Subscription } from 'rxjs';

interface CategoryChild {
  catId: number,
  category: Category,
  posts: Post[]
}

interface UserExt extends User {
  description: string;
}

@Component({
  selector: 'ssg-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit, OnDestroy {

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

  category: Category;
  author: UserExt;
  children: CategoryChild[] = [];
  posts: Post[] = [];
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
  private routeSub: Subscription = new Subscription();

  constructor(
    private wpService: WpService,
    private colorService: ColorService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.randomColor = this.colorService.generateHslaColors(100)[0];
    // load posts (page 1)
    if (this._postsFrom && this._postsOf && !this.loadingPosts) {
      // console.log('postsFrom', this._postsFrom);
      // console.log('postsOf', this._postsOf);
      this.loadPosts();
    }

    this.routeSub = this.route.url.subscribe({
      next: (segments: UrlSegment[]) => {
        this.loadingPosts = false;
        // todo reset content
      }
    });
    
  }

  ngOnDestroy(): void {
    this.loadingPosts = false;
    this.routeSub.unsubscribe();
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
        this.children = this.wpService.categoryChildren(this.category.id).map((child: Category) => {
          const catChild: CategoryChild = {
            catId: child.id,
            category: child,
            posts: []
          }
          return catChild;
        });
        // console.log('getCategoryPosts category', this.category);
        // console.log('getCategoryPosts children', this.children);
        // set title
        this.title = this.category.name;
        // console.log('children', this.children);
        // console.log('categorySlug', categorySlug);
        // no children
        if (this.children.length === 0 || categorySlug === 'screensavers') {
          // this.loadingPosts = true;
          const getCatPostsSub: Subscription = this.wpService.getCategoryPosts(this.category.id, this.postsPage, true).subscribe((res: HttpResponse<any>) => {
            this.recievePosts(res);
            // unsubscribe
            getCatPostsSub.unsubscribe();
          });
        } else {
          console.warn('getCategoryPosts -> children', this.children);
          this.loadingPosts = false;
          for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i];
            const getCatPostsSub: Subscription = this.wpService.getCategoryPosts(child.catId, this.postsPage, false).subscribe({
              next: (posts: Post[]) => {
                child.posts = posts;
                if (i === this.children.length - 1) {
                  this.loadingPosts = false;
                }
                console.log('child', child);
                console.log(`posts of ${child.category.slug}`, posts);
                getCatPostsSub.unsubscribe();
              },
              error: (e: any) => {
                console.error(e);
                getCatPostsSub.unsubscribe();
              }
            });
          }
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
        // const author = user;
        this.author = user as UserExt;
        console.log('author', user);
        this.title = (this.author.name === '&amp;' ? '&' : this.author.name);
        const getPostsByAuthorSub: Subscription = this.wpService.getPostsByAuthor(this.author.id, this.postsPage, true).subscribe((r: any) => {
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
