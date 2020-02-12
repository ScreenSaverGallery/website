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

  private _categories: any[] = [];
  private _users: any[] = [];
  private _pages: any[] = [];
  private _tags: any[] = [];
  private _media: any[] = [];

  categories: BehaviorSubject<any> = new BehaviorSubject(null);
  users: BehaviorSubject<HttpResponse<any>> = new BehaviorSubject(null);
  pages: BehaviorSubject<any> = new BehaviorSubject(null);
  tags: BehaviorSubject<HttpResponse<any>> = new BehaviorSubject(null);
  media: BehaviorSubject<HttpResponse<any>> = new BehaviorSubject(null);


  constructor(
    private wpApiService: WpApiLibService
  ) { }

  /* POSTS */

  getPosts(params?: string): Observable<any> {
    return this.wpApiService.getPosts(params ? params : '');
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
    const subject: Subject<any> = new Subject();
    let user: any = this.getLoadedUser(id);
    if (user) {
      setTimeout(() => {
        subject.next(user);
        subject.complete();
      }, 100);
    } else {
      this.wpApiService.getUser(id).subscribe((res: any) => {
        if (res.status === 200) {
          user = res.body;
          this._users.push(user);
          subject.next(user);
          subject.complete();
        }
      });
    }
    
    return subject;
  }

  getUserBySlug(slug: string): Observable<any> {
    const subject: Subject<any> = new Subject();
    let user: any = this.getLoadedUser(null, slug);
    if (user) {
      setTimeout(() => {
        subject.next(user);
        subject.complete();
      }, 10);
    } else {
      this.wpApiService.getUsers(`slug=${slug}`).subscribe((res: any) => {
        // console.log('getUsers by slug', res);
        if (res.status === 200) {
          user = res.body[0];
          this._users.push(user);
          subject.next(user);
          subject.complete();
        }
      });
    }
    return subject;
  }

  private getLoadedUser(id?: number, slug?: string): any {
    let i: number = 0;
    const len: number = this._users.length;
    for (i; i < len; i++) {
      const user: any = this._users[i];
      if (id && user.id === id || slug && user.slug === slug) {
        return user;
      }
    }
    return null;
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

  // getTags(): void {
  //   this.wpApiService.getTags(`orderby=name`).subscribe((res: any) => {
  //     if (res && res.body) {
  //       // console.log('getTags', res);
  //       this._tags = res.body;
  //       this.tags.next(res);
  //     }
  //   });
  // }

  // TODO: OPTIMIZE LOADING ONCE ONLY
  getTag(id: number): Observable<any> {
    const subject: Subject<any> = new Subject();
    const tag = this.getLoadedTag(id);
    if (tag) {
      setTimeout(() => {
        subject.next(tag);
        subject.complete();
      }, 10);
    } else {
      this.wpApiService.getTag(id).subscribe((res: any) => {
        if (res.status === 200) {
          // console.log(res.body);
          this._tags.push(res.body);
          subject.next(res.body);
          subject.complete();
        }
        
      });
    }
    return subject;
  }

  getTagBySlug(slug: string): Observable<any> {
    const subject: Subject<any> = new Subject();
    const tag = this.getLoadedTag(null, slug);
    if (tag) {
      setTimeout(() => {
        subject.next(tag);
        subject.complete();
      }, 10);
    } else {
      this.wpApiService.getTags(`slug=${slug}`).subscribe((res: any) => {
        if (res.status === 200) {
          // console.log(res.body);
          this._tags.push(res.body[0]);
          subject.next(res.body[0]);
          subject.complete();
        }
        
      });
    }
    return subject;
    // return this.wpApiService.getTags(`slug=${slug}`);
  }

  private getLoadedTag(id?: number, slug?: string): any {
    for (let i = 0; i < this._tags.length; i++) {
      const tag = this._tags[i];
      if (id && id === tag.id || slug && slug === tag.slug) {
        return tag;
      }
    }
    return null;
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
