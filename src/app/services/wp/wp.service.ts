import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// services
import { WpApiLibService } from 'wp-api-lib';
// rxjs
import {
  BehaviorSubject,
  Observable,
  Subject
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

  posts: BehaviorSubject<HttpResponse<any>> = new BehaviorSubject(null);
  categories: BehaviorSubject<any> = new BehaviorSubject(null);
  users: BehaviorSubject<HttpResponse<any>> = new BehaviorSubject(null);
  pages: BehaviorSubject<any> = new BehaviorSubject(null);
  tags: BehaviorSubject<HttpResponse<any>> = new BehaviorSubject(null);
  media: BehaviorSubject<HttpResponse<any>> = new BehaviorSubject(null);

  numberOfPosts: number = 0;
  maxResults: number = 100;

  constructor(
    private wpApiService: WpApiLibService
  ) { }

  /* POSTS */

  getPosts(): void {
    this.wpApiService.getPosts().subscribe((res: HttpResponse<any>) => {
      if (res && res.body) {
        // console.log('getPosts', res);
        this.posts.next(res);
        this._posts = res.body;
      }
    });
  }

  getPostBySlug(slug: string): Observable<HttpResponse<any>> {
    return this.wpApiService.getPosts(`slug=${slug}`);
  }

  getPostsByTag(tag: number, page: number = 1): Observable<HttpResponse<any>> {
    return this.wpApiService.getPosts(`tags=${tag}&orderby=date&page=${page}`);
  }

  getPostsByAuthor(authorId: number, page: number = 1): Observable<HttpResponse<any>> {
    return this.wpApiService.getPosts(`author=${authorId}&orderby=date&page=${page}`);
  }

  getCategoryPosts(id: number, page: number = 1): Observable<HttpResponse<any>> {
    return this.wpApiService.getPosts(`categories=${id}&orderby=date&page=${page}`);
  }

  /* CATEGORIES */

  getAllCategories(): void {
    this.wpApiService.getCategories('orderby=count&order=desc').subscribe((res: HttpResponse<any>) => {
      if (res && res.body && res.body.length > 0) {
        const temp: any[] = this._categories;
        const total = Number(res.headers.get('X-WP-Total'));
        const totalPages = Number(res.headers.get('X-WP-TotalPages'));
        this._categories = temp.concat(res.body);
        this.categories.next(this._categories);
        // load every category
        if (total > this._categories.length) {
          for (let i = 2; i <= totalPages; i++) {
            // console.log('getCategories page', i);
            this.getCategories(i);
          }
        }
      }
    });
  }

  getCategories(page: number): void {
    this.wpApiService.getCategories(`orderby=count&order=desc&page=${page}`).subscribe((res: HttpResponse<any>) => {
      if (res && res.body && res.body.length > 0) {
        // concat arrays
        const temp: any[] = this._categories;
        this._categories = temp.concat(res.body);
        this.categories.next(this._categories);
      }
    });
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

  categoryChildren(id: number): number[] {
    let i = 0;
    const len = this._categories.length;
    const result: number[] = [];
    for (i; i < len; i++) {
      const cat: any = this._categories[i];
      if (cat.parent === id) {
        result.push(cat);
      }
    }
    return result;
  }

  

  

  /* USERS */

  getUsers(): void {
    this.wpApiService.getUsers(`orderby=name`).subscribe((res: any) => {
      if (res && res.body) {
        // console.log('getUsers', res);
        this._users = res.body;
        this.users.next(res);
      }
    });
  }

  getUser(id: number): Observable<any> {
    return this.wpApiService.getUser(id);
  }

  getUserBySlug(slug: string): Observable<any> {
    return this.wpApiService.getUsers(`slug=${slug}`);
  }

  /* PAGES */

  getAllPages(): void {
    // console.log('getAllPages');
    this.wpApiService.getPages().subscribe((res: HttpResponse<any>) => {
      if (res && res.body && res.body.length > 0) {
        const temp: any[] = this._pages;
        const total = Number(res.headers.get('X-WP-Total'));
        const totalPages = Number(res.headers.get('X-WP-TotalPages'));

        this._pages = temp.concat(res.body);
        this.pages.next(this._pages);

        if (total > this._pages.length) {
          for (let i = 2; i <= totalPages; i++) {
            // console.log('getCategories page', i);
            this.getPages(i);
          }
        }

      }
    });
  }

  getPages(pageNumber: number = 1): void {
    this.wpApiService.getPages(`page=${pageNumber}`).subscribe((res: HttpResponse<any>) => {
      if (res && res.body && res.body.length > 0) {
        // console.log('getPages', res);
        const temp: any[] = this._pages;
        this._pages = temp.concat(res.body);
        this.pages.next(this._pages);
      }
    });
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

  /* TAGS */

  getTags(): void {
    this.wpApiService.getTags(`orderby=name`).subscribe((res: any) => {
      if (res && res.body) {
        // console.log('getTags', res);
        this._tags = res.body;
        this.tags.next(res);
      }
    });
  }

  getTag(id: number): Observable<any> {
    return this.wpApiService.getTag(id);
  }

  getTagBySlug(slug: string): Observable<any> {
    return this.wpApiService.getTags(`slug=${slug}`);
  }

  getTagPosts(id: number): Observable<any> {
    return this.wpApiService.getPosts(`tags=${id}`);
  }

  /* MEDIAS */

  getMedias(): void {
    this.wpApiService.getMedias().subscribe((res: any) => {
      if (res && res.body) {
        console.log('getMedias', res);
        this._media = res.body;
        this.media.next(res);
      }
    });
  }

  getMedia(id: number): Observable<any> {
    return this.wpApiService.getMedia(id);
  }
  // ...
}
