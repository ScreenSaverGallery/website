import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
// services
// import { ThemeService } from './services/theme/theme.service';
// import { SiteInfoService } from './services/site-info/site-info.service';
// import { ColorService } from './services/color/color.service';
import { SnackService } from './services/snack/snack.service';
import { WpService } from './services/wp/wp.service';
// import { FeedService } from './services/feed/feed.service';
import { SliderItem } from './components/info-slider/info-slider.component';
// rxjs
import { Subscription } from 'rxjs';
// ngx-wp-api
import { Post } from '@tomaszatoo/ngx-wp-api';
import { NgClass } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './components/menu/menu.component';
import { InfoSliderHorizontalComponent } from './components/info-slider-horizontal/info-slider-horizontal.component';

@Component({
    selector: 'ssg-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [NgClass, RouterOutlet, MenuComponent, InfoSliderHorizontalComponent]
})
export class AppComponent implements OnInit, OnDestroy {

  title: string = 'Screensaver';
  bwTheme: boolean = false;
  OS: string = 'Unknown';

  addSliderItem: SliderItem = undefined;

  // private _backgroundColorSubscription: Subscription = new Subscription();
  private _isMobile = (/Mobile/i.test(navigator.userAgent));

  private _getCurrentSaverSub: Subscription = new Subscription();
  private _getCurrentOfflineSaverSub: Subscription = new Subscription();
  private _getLastNewsSub: Subscription = new Subscription();

  constructor(
    // private themeService: ThemeService,
    // private siteInfoService: SiteInfoService,
    // private colorService: ColorService,
    private snackService: SnackService,
    // private feedService: FeedService,
    private wpService: WpService,
    private appElm: ElementRef
  ){}

  ngOnInit(): void {
    // get rss feed
    // this.feedService.getFeed();
    // add os as class
    this.OS = this.getOS();
    this.appElm.nativeElement.setAttribute('id', this.OS.toLowerCase());
    this.appElm.nativeElement.classList.add(this._isMobile ? 'mobile' : 'desktop');
    this.snackService.openSnackBar('This site does not track you.', '🥰 Ok');

    // get name of last screensaver
    this._getCurrentSaverSub = this.wpService.getCurrentScreensaver().subscribe({
      next: (posts: Post[]) => {
        // this.starsText = res.body[0].title.rendered;
        // console.log('res.body', res.body);
        if (posts && posts.length) {
          const post = posts[0];
          // if (post.featured_media) {
          //   // console.log('res.body', res.body[0]);
          //   this.getFeautredImage(post.featured_media);
          // }
          const currentShow: SliderItem = {
            emoji: 'Online Now',
            text: post.title.rendered,
            // delay: 10000,
            url: post.slug
          }
          this.addSliderItem = currentShow;
        }

        this._getCurrentSaverSub.unsubscribe();
      },
      error: (e: any) => console.error(e)
    });

    // get name of last offline screensaver
    this._getCurrentOfflineSaverSub = this.wpService.getCurrentOfflineScreensaver().subscribe({
      next: (posts: Post[]) => {
        if (posts.length) {
          const post = posts[0];
          const currentOfflineShow: SliderItem = {
            emoji: 'Offline Now',
            text: post.title.rendered,
            // delay: 10000,
            url: post.slug
          }
          this.addSliderItem = currentOfflineShow;
        }
        this._getCurrentOfflineSaverSub.unsubscribe();
      },
      error: (e: any) => console.error(e)        
    });

    /* TODO: hot 🔥NEWS🔥 to slider */
    /* 2 month news (60 days) */
    // https://developer.wordpress.org/rest-api/reference/posts/
    const today = Date.now();
    const period = 60 * (24 * 60 * 60 * 1000); // set to 60 days
    const queryDate = new Date(today - period).toISOString();
    console.log('🔥 NEWS 🔥 queryDate', queryDate);
    this._getLastNewsSub = this.wpService.getPosts(`categories=1&orderby=date&per_page=2&after=${queryDate}`).subscribe({
      next: (posts: Post[]) => {
        if (posts.length) {
          console.log('NEWS res', posts);
          for (let i = 0; i < posts.length; i++) {
            const news = posts[i];
            const message: SliderItem = {
              emoji: 'News', // '🦑 🐣 🐍',
              text: news.title.rendered,
              // delay: 10000,
              url: news.slug
            }
            // slower adding
            setTimeout(() => this.addSliderItem = message, i * 100);
          }
        }

        this._getLastNewsSub.unsubscribe();
      },
      error: (e: any) => console.error(e)
    });
  }

  ngOnDestroy(): void {
    // this.colorService.destroyAnimations();
    // this._backgroundColorSubscription.unsubscribe();
    this._getCurrentSaverSub.unsubscribe();
    this._getCurrentOfflineSaverSub.unsubscribe();
    this._getLastNewsSub.unsubscribe();
  }

  menuAction(open: boolean): void {
    // console.log('menu is open?', open);
    if (open) {
      this.appElm.nativeElement.classList.add('active-menu');
    } else {
      this.appElm.nativeElement.classList.remove('active-menu');
    }
  }

  private getOS(): string {
    let result: string;
    const app: string = navigator.userAgent;
    console.log('navigator.userAgent', navigator.userAgent);
    if (app.indexOf('Win') != -1) result = 'Win';
    if (app.indexOf('Mac') != -1) result = 'Mac';
    if (app.indexOf('iPhone') != -1 || app.indexOf('iPod') != -1 || app.indexOf('iPad') != -1) result = 'iOS';
    if (app.indexOf('X11') != -1) result = 'UNIX';
    if (app.indexOf('Linux') != -1) result = 'Linux';

    return result;
  }

  log(key: any, value: any): void {
    console.log(key, value);
  }
}
