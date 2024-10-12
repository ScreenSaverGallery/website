import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Input,
  ElementRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, UrlSegment, Router } from '@angular/router';
import { Page, Post } from '@tomaszatoo/ngx-wp-api';
// services
import { WpService } from '../../services/wp/wp.service';
import { ColorService } from '../../services/color/color.service';
// import { ThemeService } from '../../services/theme/theme.service';
import { LinksService } from '../../services/links/links.service';
import { SnackService } from '../../services/snack/snack.service';
// interfaces
import { Media } from '@tomaszatoo/ngx-wp-api';
// rxjs
import { Subscription } from 'rxjs';

@Component({
  selector: 'ssg-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, OnDestroy {

  @Input() post: any;
  // @Input() highlighted: boolean = false;
  pinned: boolean = false;
  loadedPost: any;
  postType: string = 'post';

  downloadLink: string;

  randomColor: string = 'silver';
  ssgIconColor: string = 'red';

  hasFeaturedImage: boolean = false;

  // postClass: string = '';

  social: any[] = [
    {name: 'facebook', shortcut: 'fb', urlBase: 'https://facebook.com/sharer/sharer.php?u='},
    {name: 'X', shortcut: 'x', urlBase: 'https://twitter.com/intent/tweet?text='},
    {name: 'telegram', shortcut: 'tg', urlBase: 'https://t.me/share/url?url='}
  ];

  routeSubscription: Subscription;
  // wpSubscription: Subscription;

  @ViewChild('featuredImage') featuredImgContainer: ElementRef;

  constructor(
    private wpService: WpService,
    private route: ActivatedRoute,
    private router: Router,
    private colorService: ColorService,
    private elm: ElementRef,
    // private themeService: ThemeService,
    private linksService: LinksService,
    private snackService: SnackService
  ) { }

  ngOnInit() {
    // console.log('init post component post', this.post);
    this.downloadLink = this.linksService.downloadLink;
    this.randomColor = this.colorService.generateHslaColors(100)[0];
    
    // if not post, get it from url
    if (!this.post) {
      this.hasFeaturedImage = false;
      this.routeSubscription = this.route.url.subscribe({
        next: (url: UrlSegment[]) => {
          // clean first
          this._cleanPostElm();
          // slug
          const slug: string = url[0].path;
          // get page first
          const getPageSub: Subscription = this.wpService.getPageBySlug(slug).subscribe({
            next: (pages: Page[]) => {
              // console.log('page', page);
              const pageBody = pages[0];
              if (pageBody) {
                this.loadedPost = pageBody;
                this._postFeatures(this.loadedPost);
                this.postType = 'page';
              } else {
                // get post if no page by slug
                const getPostSub: Subscription = this.wpService.getPostBySlug(slug).subscribe({
                  next: (posts: Post[]) => {
                    const postBody = posts[0];
                    // console.log('postBody', postBody);
                    if (postBody) {
                      this.loadedPost = postBody;
                      this._postFeatures(this.loadedPost);
                      this.postType = 'post';
                    } else {
                      // navigate to 404
                      this.router.navigate(['/error/404']);
                    }
                    getPostSub.unsubscribe();

                  },
                  error: (e: any) => {
                    console.log('error loading post', e);
                    this.snackService.openSnackBar(e, 'Close');
                  }
                });
              }
              getPageSub.unsubscribe();
            },
            error: (e: any) => {
              console.log('error loading page', e);
              this.snackService.openSnackBar(e, 'Close');
            }
          });
        },
        error: (e: any) => {
          console.log('route error', e);
          this.snackService.openSnackBar(e, 'Close');
        }
      });
    }
      
  }

  // ngAfterViewInit(): void {
// 
  //  
  //   // if (this.loadedPost) {
  //   //   console.log('loadedPost after view init', this.loadedPost);
  //   // }
  // }

  ngOnDestroy(): void {
    if (this.routeSubscription) this.routeSubscription.unsubscribe();
    // if (this.wpSubscription) this.wpSubscription.unsubscribe();
    // console.log('destroy post component');
    // if (this.postClass) this.elm.nativeElement.classList.remove(this.postClass);
  }

  private _postFeatures(post: any): void {
    console.log('post', post);
    setTimeout(() => {
      this._animateImagesColor();
    }, 2000);
    if (post['featured_media']) this._getFeautredImage(post['featured_media']);
    if (post['slug']) this.elm.nativeElement.classList.add(post['slug']);
  }

  private _cleanPostElm(): void {
    this.loadedPost = undefined;
    this.elm.nativeElement.classList.remove(...this.elm.nativeElement.classList);
    if (this.featuredImgContainer && this.featuredImgContainer.nativeElement) this.featuredImgContainer.nativeElement.style.backgroundImage = 'none';
  }


  private _animateImagesColor(): void {
    // console.log('elm', this.elm);
    const images = this.elm.nativeElement.querySelectorAll('img');
    // console.log('images', images);
    images.forEach((img: HTMLImageElement) => {
      this.colorService.animateRandomColor(1, 0, 100, 70, 1.0).subscribe({
        next: (hsla: string) => {
          img.style.borderColor = hsla;
        }
      })
    });
  }

  

  getRefUrl(): string {
    return `${window.location.protocol}//${window.location.host}/${this.post.slug}`;
  }

  togglePin(): void {
    this.pinned = !this.pinned;
    this.elm.nativeElement.classList.toggle('pinned');
  }

  private _getFeautredImage(id: number): void {
    // console.log('getFeaturedImage', id);
    // console.log('featuredImage child', this.featuredImgContainer);
    const mediaSubscribtion: Subscription = this.wpService.getMedia(id).subscribe({
      next: (media: Media) => {
        // console.log('recieved media', media);
        if (media && media.source_url) {
          
          const image = new Image();
          image.onload = () => {
            this.hasFeaturedImage = true;
            this.featuredImgContainer.nativeElement.style.backgroundImage = `url(${image.src})`;
            setTimeout(() => {
              this.featuredImgContainer.nativeElement.classList.add('fadeInFromNone');
            }, 1000);
          }
          setTimeout(function(){
            image.src = media.source_url;         
        }, 100);
          
        }
        mediaSubscribtion.unsubscribe();
      },
      error: (e: any) => {
        console.log(e);
        this.snackService.openSnackBar(e, 'Close');
        mediaSubscribtion.unsubscribe();
      }
    })
  }

}
