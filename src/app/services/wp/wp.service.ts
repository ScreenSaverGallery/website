import { Injectable } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
// services
// import { WpApiLibService } from 'wp-api-lib';
// import { ErrorService } from '../error/error.service';
import {
  NgxWpApiService,
  Post,
  Category,
  User,
  Tag,
  Media,
  Page,
  Menu,
} from "@tomaszatoo/ngx-wp-api";
// rxjs
import { BehaviorSubject, Observable, Subject, Subscription } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class WpService {
  private _categories: any[] = [];
  private _users: any[] = [];
  private _pages: any[] = [];
  private _tags: any[] = [];
  private _media: any[] = [];

  categories: BehaviorSubject<Category[] | null> = new BehaviorSubject(null);
  users: BehaviorSubject<User[] | null> = new BehaviorSubject(null);
  pages: BehaviorSubject<Page[] | null> = new BehaviorSubject(null);
  tags: BehaviorSubject<Tag[] | null> = new BehaviorSubject(null);
  media: BehaviorSubject<Media[] | null> = new BehaviorSubject(null);

  constructor(private wpApiService: NgxWpApiService) {
    this.getAllCategories();
    this.getAllPages();
  }

  /* POSTS */

  getCurrentScreensaver(): Observable<Post[] | HttpResponse<any>> {
    const onlineCategoryId: number = 323;
    return this.getPosts(
      `categories=${onlineCategoryId}&orderby=date&per_page=1`,
    );
  }
  getCurrentOfflineScreensaver(): Observable<Post[] | HttpResponse<any>> {
    const offlineCategoryId: number = 324;
    return this.getPosts(
      `categories=${offlineCategoryId}&orderby=date&per_page=1&filter[tag]=offline`,
    );
  }

  getPosts(params?: string): Observable<Post[] | HttpResponse<any>> {
    return this.wpApiService.getPosts(params ? params : "");
  }

  getPostBySlug(slug: string): Observable<Post[] | HttpResponse<any>> {
    return this.wpApiService.getPosts(`slug=${slug}`);
  }

  getPostsByTag(
    tag: number,
    page: number = 1,
    observeResponse: boolean = false,
  ): Observable<Post[] | HttpResponse<any>> {
    return this.wpApiService.getPosts(
      `tags=${tag}&orderby=date&page=${page}`,
      observeResponse,
    );
  }

  getPostsByAuthor(
    authorId: number,
    page: number = 1,
    observeResponse: boolean = false,
  ): Observable<Post[] | HttpResponse<any>> {
    return this.wpApiService.getPosts(
      `author=${authorId}&orderby=date&page=${page}`,
      observeResponse,
    );
  }

  getCategoryPosts(
    id: number,
    page: number = 1,
    observeResponse: boolean = false,
  ): Observable<Post[] | HttpResponse<any>> {
    return this.wpApiService.getPosts(
      `categories=${id}&orderby=date&per_page=10&page=${page}`,
      observeResponse,
    );
  }

  search(query: string, page: number = 1): Observable<any> {
    return this.wpApiService.search(`${query}&page=${page}`);
  }

  getSiteInfo(): Observable<any> {
    return this.wpApiService.getSiteInfo();
  }

  /* CATEGORIES */

  getAllCategories(): void {
    this.wpApiService
      .getCategories("orderby=count&order=asc&per_page=100", true)
      .subscribe((res: HttpResponse<any>) => {
        if (res && res.body && res.body.length > 0) {
          const temp: any[] = this._categories;
          const total = Number(res.headers.get("X-WP-Total"));
          const totalPages = Number(res.headers.get("X-WP-TotalPages"));
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
    console.warn("getCategories ...pageNum", page);
    const getCategoriesSub: Subscription = this.wpApiService
      .getCategories(`orderby=count&order=asc&page=${page}`)
      .subscribe((categories: Category[]) => {
        if (categories && categories.length > 0) {
          // concat arrays
          const temp: any[] = this._categories;
          this._categories = temp.concat(categories);
          this.categories.next(this._categories);
          // unsubscribe
          getCategoriesSub.unsubscribe();
        }
      });
  }

  getCategoryBySlug(slug: string): Category {
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

  childCategories(id: number): Category[] {
    let i = 0;
    const len = this._categories.length;
    const result: Category[] = [];
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
    const getUsersSub: Subscription = this.wpApiService
      .getUsers(`orderby=name`)
      .subscribe((users: User[]) => {
        if (users && users.length) {
          // console.log('getUsers', res);
          this._users = users;
          this.users.next(users);
          // unsubscribe
          getUsersSub.unsubscribe();
        }
      });
  }

  getUser(id: number): Observable<User> {
    const subject: Subject<User> = new Subject();
    let user: any = this.getLoadedUser(id);
    if (user) {
      setTimeout(() => {
        subject.next(user);
        subject.complete();
      }, 100);
    } else {
      const getUserSub: Subscription = this.wpApiService
        .getUser(id)
        .subscribe((u: User) => {
          if (u) {
            user = u;
            this._users.push(user);
            subject.next(user);
            subject.complete();
            // unsubscribe
            getUserSub.unsubscribe();
          }
        });
    }

    return subject;
  }

  getUserBySlug(slug: string): Observable<User> {
    const subject: Subject<User> = new Subject();
    let user: any = this.getLoadedUser(null, slug);
    if (user) {
      setTimeout(() => {
        subject.next(user);
        subject.complete();
      }, 10);
    } else {
      const getUsersSub: Subscription = this.wpApiService
        .getUsers(`slug=${slug}`)
        .subscribe((users: User[]) => {
          // console.log('getUsers by slug', res);
          if (users && users.length) {
            user = users[0];
            this._users.push(user);
            subject.next(user);
            subject.complete();
            // unsubscribe
            getUsersSub.unsubscribe();
          }
        });
    }
    return subject;
  }

  private getLoadedUser(id?: number, slug?: string): User | null {
    let i: number = 0;
    const len: number = this._users.length;
    for (i; i < len; i++) {
      const user: any = this._users[i];
      if ((id && user.id === id) || (slug && user.slug === slug)) {
        return user;
      }
    }
    return null;
  }

  /* PAGES */

  getAllPages(): void {
    // console.log('getAllPages');
    const getPagesSub: Subscription = this.wpApiService
      .getPages("order_by=date&order=asc", true)
      .subscribe((res: HttpResponse<any>) => {
        if (res && res.body && res.body.length > 0) {
          const temp: any[] = this._pages;
          const total = Number(res.headers.get("X-WP-Total"));
          const totalPages = Number(res.headers.get("X-WP-TotalPages"));

          this._pages = temp.concat(res.body);
          this.pages.next(this._pages);

          if (total > this._pages.length) {
            for (let i = 2; i <= totalPages; i++) {
              // console.log('getCategories page', i);
              this.getPages(i);
            }
          }
          // unsubscribe
          getPagesSub.unsubscribe();
        }
      });
  }

  getPages(pageNumber: number = 1): void {
    const getPagesSub: Subscription = this.wpApiService
      .getPages(`page=${pageNumber}`)
      .subscribe((pages: Page[]) => {
        if (pages && pages.length) {
          // console.log('getPages', res);
          const temp: any[] = this._pages;
          this._pages = temp.concat(pages);
          this.pages.next(this._pages);
        }
        // unsubscribe
        getPagesSub.unsubscribe();
      });
  }

  getPageBySlug(slug: string): Observable<Page[] | HttpResponse<any>> {
    return this.wpApiService.getPages(`slug=${slug}`);
  }

  // getPageBySlug(slug: string): number {
  //   if (this._pages.length > 0) {
  //     let i: number = 0;
  //     const len: number = this._pages.length;
  //     for (i; i < len; i++) {
  //       if (this._pages[i].slug === slug) {
  //         return this._pages[i];
  //       }
  //     }
  //   }
  //   return null;
  // }

  /* TAGS */

  // getTags(): Observable<HttpResponse<any>> {
  //   this.wpApiService.getTags(`orderby=name`).subscribe((res: any) => {
  //     if (res && res.body) {
  //       // console.log('getTags', res);
  //       this._tags = res.body;
  //       this.tags.next(res);
  //     }
  //   });
  // }

  // TODO: OPTIMIZE LOADING ONCE ONLY
  getTag(id: number): Observable<Tag> {
    const subject: Subject<Tag> = new Subject();
    const tag = this.getLoadedTag(id);
    if (tag) {
      setTimeout(() => {
        subject.next(tag);
        subject.complete();
      }, 10);
    } else {
      const getTagSub: Subscription = this.wpApiService
        .getTag(id)
        .subscribe((tag: Tag) => {
          if (tag) {
            // console.log(res.body);
            this._tags.push(tag);
            subject.next(tag);
            subject.complete();
          }
          // unsubscribe
          getTagSub.unsubscribe();
        });
    }
    return subject;
  }

  getTagBySlug(slug: string): Observable<Tag> {
    const subject: Subject<Tag> = new Subject();
    const tag = this.getLoadedTag(null, slug);
    if (tag) {
      setTimeout(() => {
        subject.next(tag);
        subject.complete();
      }, 10);
    } else {
      const getTagsSub: Subscription = this.wpApiService
        .getTags(`slug=${slug}`)
        .subscribe((tags: Tag[]) => {
          if (tags) {
            // console.log(res.body);
            this._tags.push(tags[0]);
            subject.next(tags[0]);
            subject.complete();
            getTagsSub.unsubscribe();
          }
        });
    }
    return subject;
    // return this.wpApiService.getTags(`slug=${slug}`);
  }

  private getLoadedTag(id?: number, slug?: string): Tag | null {
    for (let i = 0; i < this._tags.length; i++) {
      const tag = this._tags[i];
      if ((id && id === tag.id) || (slug && slug === tag.slug)) {
        return tag;
      }
    }
    return null;
  }

  getTagPosts(id: number): Observable<Post[] | HttpResponse<any>> {
    return this.wpApiService.getPosts(`tags=${id}`);
  }

  /* MEDIAS */

  getMedias(): Observable<Media[] | HttpResponse<any>> {
    return this.wpApiService.getMedias();
    // TODO: getMeidas only return...
    // this.wpApiService.getMedias().subscribe((medias: Media[]) => {
    //   if (medias && medias.length) {
    //     // console.log('getMedias', res);
    //     this._media = medias;
    //     this.media.next(medias);
    //   }
    // });
  }

  getMedia(id: number): Observable<Media> {
    return this.wpApiService.getMedia(id);
  }

  /* MENUS */
  getMenus(): Observable<Menu[]> {
    return this.wpApiService.getMenus();
  }

  getMenuById(id: number): Observable<Menu> {
    return this.wpApiService.getMenu(id);
  }
  getMenuBySlug(slug: string): Observable<Menu> {
    return this.wpApiService.getMenu(slug);
  }
  // ...
}
