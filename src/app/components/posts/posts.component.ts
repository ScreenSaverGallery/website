import { Component, OnInit, OnDestroy, Input } from "@angular/core";
// router
import { ActivatedRoute, UrlSegment, RouterLink } from "@angular/router";
// services
import { WpService } from "../../services/wp/wp.service";
import { ColorService } from "../../services/color/color.service";
import { Category, Post, User, Tag } from "@tomaszatoo/ngx-wp-api";
import { HttpResponse } from "@angular/common/http";
// rxjs
import { Subscription, take } from "rxjs";
//
import { TitleCasePipe } from "@angular/common";
import { PostComponent } from "../post/post.component";
import { LoadMoreComponent } from "../load-more/load-more.component";
import { LoadingComponent } from "../loading/loading.component";
import { ButtonComponent } from "../button/button.component";
import { SafeHtmlPipe } from "../../pipes/safe-html.pipe";

interface CategoryChild {
  catId: number;
  category: Category;
  posts: Post[];
}

interface UserExt extends User {
  description: string;
}

@Component({
  selector: "ssg-posts",
  templateUrl: "./posts.component.html",
  styleUrls: ["./posts.component.scss"],
  standalone: true,
  imports: [
    PostComponent,
    LoadMoreComponent,
    RouterLink,
    LoadingComponent,
    ButtonComponent,
    TitleCasePipe,
    SafeHtmlPipe,
  ],
})
export class PostsComponent implements OnInit, OnDestroy {
  @Input() set postsOf(value: string) {
    this._postsOf = value;
    // reset
    this.posts = [];
    this.postsPage = 1;
    this.slug = value;
    if (!this.loadingPosts) this.loadPosts();
  }
  @Input() set postsFrom(value: string) {
    this._postsFrom = value;
  }

  private _postsOf: string;
  private _postsFrom: string;

  category: Category;
  author: UserExt;
  childCategories: CategoryChild[] = [];
  posts: Post[] = [];
  maxVisiblePosts: number = 30;
  postsPage: number = 1;
  total: number;
  totalPages: number;
  private loadingPosts: boolean = false;

  title: string;
  slug: string;
  randomColor: string = "silver";

  // bwTheme: boolean = false;

  private getCategoriesSub: Subscription = new Subscription();
  private routeSub: Subscription = new Subscription();

  constructor(
    private wpService: WpService,
    private colorService: ColorService,
    private route: ActivatedRoute,
  ) {}

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
      },
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
      case "archive":
        this.getCategoryPosts(this._postsOf);
        break;
      case "tag":
        this.getTagPosts(this._postsOf);
        break;
      case "author":
        this.getAuthorPosts(this._postsOf);
        break;
    }
  }

  /* GET CATEGORY POSTS */
  private getCategoryPosts(categorySlug: string): void {
    this.wpService.categories
      .pipe(take(2)) // take second (why?)
      .subscribe((categories: Category[]) => {
        if (categories) {
          this.category = this.wpService.getCategoryBySlug(categorySlug);
          this.childCategories = this.wpService
            .childCategories(this.category.id)
            .map((child: Category) => {
              const catChild: CategoryChild = {
                catId: child.id,
                category: child,
                posts: [],
              };
              return catChild;
            });
          // console.log('getCategoryPosts category', this.category);
          // console.log('getCategoryPosts children', this.childCategories);
          // set title
          this.title = this.category.name;
          // console.log("CATEGORY NAME", this.title);
          // console.log('children', this.childCategories);
          // console.log('categorySlug', categorySlug);
          // no children
          if (
            this.childCategories.length === 0 ||
            categorySlug === "screensavers"
          ) {
            console.log(
              "0 child categories && screensavers categorySlug",
              categorySlug,
            );
            // this.loadingPosts = true;
            console.log("---- category", this.category);
            console.log("---- postPage", this.postsPage);
            this.wpService
              .getCategoryPosts(this.category.id, this.postsPage, true)
              .pipe(take(1))
              .subscribe({
                next: (res: HttpResponse<any>) => {
                  this.recievePosts(res);
                  // this.loadingPosts = false;
                },
                error: (e: any) => console.error(e),
              });
          } else {
            console.warn("getCategoryPosts -> children", this.childCategories);
            this.loadingPosts = false;
            for (let i = 0; i < this.childCategories.length; i++) {
              const child = this.childCategories[i];
              this.wpService
                .getCategoryPosts(child.catId, this.postsPage, false)
                .pipe(take(1))
                .subscribe({
                  next: (posts: Post[]) => {
                    console.log("CATEGORY POSTS", posts);
                    child.posts = posts;
                    if (i === this.childCategories.length - 1) {
                      this.loadingPosts = false;
                    }
                    console.log("child", child);
                    console.log(`posts of ${child.category.slug}`, posts);
                  },
                  error: (e: any) => {
                    console.error(e);
                  },
                });
            }
            // sort children
            // console.log('children', this.childCategories);
            // this.childCategories = this.childCategories.sort((a: any, b: any) => parseFloat(a.id) + parseFloat(b.id) );
            // console.log('sorted children', this.childCategories);
          }
        }
      });
  }

  /* GET AUTHOR POSTS (not used) */
  private getAuthorPosts(authorSlug: string): void {
    this.wpService
      .getUserBySlug(authorSlug)
      .pipe(take(1))
      .subscribe((user: User) => {
        if (user) {
          // const author = user;
          this.author = user as UserExt;
          this.title = this.author.name.replace(/\&amp\;/g, "&");
          this.wpService
            .getPostsByAuthor(this.author.id, this.postsPage, true)
            .pipe(take(1))
            .subscribe((r: any) => {
              this.recievePosts(r);
            });
        }
      });
  }

  /* GET TAG POSTS */
  private getTagPosts(tagSlug: string): void {
    // console.log('getTagPosts', tagSlug);
    this.wpService
      .getTagBySlug(tagSlug)
      .pipe(take(1))
      .subscribe((tag: Tag) => {
        if (tag) {
          // const tag = res;
          this.title = tag.name;
          this.wpService
            .getPostsByTag(tag.id, this.postsPage, true)
            .pipe(take(1))
            .subscribe((res: HttpResponse<any>) => {
              this.recievePosts(res);
            });
        }
      });
  }

  /* RECIVE POSTS FROM TAXONOMY */
  private recievePosts(res: HttpResponse<any>): void {
    if (res && res.body && res.body.length > 0) {
      console.log("recievePosts", res.body);
      this.loadingPosts = false;
      const temp: any[] = this.posts;
      this.total = Number(res.headers.get("X-WP-Total"));
      this.totalPages = Number(res.headers.get("X-WP-TotalPages"));
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
    if (
      this.total > this.posts.length &&
      this.postsPage < this.totalPages + 1
    ) {
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
