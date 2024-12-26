import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
// services
// import { ThemeService } from './services/theme/theme.service';
// import { SiteInfoService } from './services/site-info/site-info.service';
// import { ColorService } from './services/color/color.service';
import { SnackService } from './services/snack/snack.service';
import { FeedService } from './services/feed/feed.service';
// rxjs
import { Subscription } from 'rxjs';

@Component({
  selector: 'ssg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title: string = 'Screensaver';
  bwTheme: boolean = false;
  OS: string = 'Unknown';

  // private _backgroundColorSubscription: Subscription = new Subscription();
  private _isMobile = (/Mobile/i.test(navigator.userAgent));

  constructor(
    // private themeService: ThemeService,
    // private siteInfoService: SiteInfoService,
    // private colorService: ColorService,
    private snackService: SnackService,
    private feedService: FeedService,
    private appElm: ElementRef
  ){}

  ngOnInit(): void {
    // get rss feed
    this.feedService.getFeed();
    // add os as class
    this.OS = this.getOS();
    this.appElm.nativeElement.setAttribute('id', this.OS.toLowerCase());
    this.appElm.nativeElement.classList.add(this._isMobile ? 'mobile' : 'desktop');
    this.snackService.openSnackBar('This site does not track you.', '🥰 Ok');
  }

  ngOnDestroy(): void {
    // this.colorService.destroyAnimations();
    // this._backgroundColorSubscription.unsubscribe();
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
