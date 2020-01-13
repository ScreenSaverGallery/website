import { Injectable } from '@angular/core';
// services
import { WpApiLibService } from 'wp-api-lib';
// rxjs
import {
  BehaviorSubject,
  Observable
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WpService {

  private _posts: any[] = [];
  private _categories: any[] = [];
  private _users: any[] = [];
  private _pages: any[] = [];
  private _tags: any[] = [];
  private _media: any[] = [];

  posts: BehaviorSubject<any> = new BehaviorSubject(null);
  categories: BehaviorSubject<any> = new BehaviorSubject(null);
  users: BehaviorSubject<any> = new BehaviorSubject(null);
  pages: BehaviorSubject<any> = new BehaviorSubject(null);
  tags: BehaviorSubject<any> = new BehaviorSubject(null);
  media: BehaviorSubject<any> = new BehaviorSubject(null);

  numberOfPosts: number = 0;
  maxResults: number = 100;

  constructor(
    private wpApiService: WpApiLibService
  ) { }

  getPosts(): void {
    this.wpApiService.getPosts(`per_page=${this.maxResults}`).subscribe((res: any) => {
      if (res) {
        this.posts.next(res);
        this._posts = res;
      }
    });
  }

  getPostsOfCategory(id: number): Observable<any> {
    return this.wpApiService.getPosts(`per_page=${this.maxResults}&categories=${id}&orderby=date`);
  }

  getCategories(): void {
    // if (this._categories.length === 0) {
      this.wpApiService.getCategories(`per_page=${this.maxResults}&orderby=count&order=desc`).subscribe((res: any) => {
        if (res) {
          // count posts
          res.map((category: any) => {
            this.numberOfPosts += category.count;
          });
          // console.log('numberOfPosts', this.numberOfPosts);
          this._categories = res;
          this.categories.next(res);
        }
      });
    // }
  }

  getCategoryBySlug(slug: string): any {
    if (this._categories.length > 0) {
      let i: number = 0;
      const len: number = this._categories.length;
      for (i; i < len; i++) {
        if (this._categories[i].slug === slug) {
          return this._categories[i];
        }
      }
    }
    return null;
  }

  getPageBySlug(slug: string): number {
    if (this._pages.length > 0) {
      let i: number = 0;
      const len: number = this._pages.length;
      for (i; i < len; i++) {
        if (this._pages[i].slug === slug) {
          return this._pages[i];
        }
      }
    }
    return null;
  }

  getPostBySlug(slug: string): Observable<any> {
    return this.wpApiService.getPosts(`slug=${slug}`);
  }

  getUsers(): void {
    this.wpApiService.getUsers(`per_page=${this.maxResults}&orderby=name`).subscribe((res: any) => {
      if (res) {
        this._users = res;
        this.users.next(res);
      }
    });
  }

  getPages(): void {
    this.wpApiService.getPages().subscribe((res: any) => {
      if (res) {
        this._pages = res;
        this.pages.next(res);
      }
    });
  }

  getTags(): void {
    this.wpApiService.getTags(`per_page=${this.maxResults}&orderby=name`).subscribe((res: any) => {
      if (res) {
        this._tags = res;
        this.tags.next(res);
      }
    });
  }

  getMedias(): void {
    this.wpApiService.getMedias().subscribe((res: any) => {
      if (res) {
        this._media = res;
        this.media.next(res);
      }
    });
  }
  // ...
}
