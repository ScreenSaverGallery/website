import { Component, OnInit, ElementRef, OnDestroy, AfterViewInit, AfterContentInit } from '@angular/core';
// services
import { ThemeService } from './services/theme/theme.service';
import { SiteInfoService } from './services/site-info/site-info.service';
// local storage
import { LocalStorageService } from 'local-storage';
import { ColorService } from './services/color/color.service';
// rxjs
import { Subscription } from 'rxjs';

@Component({
  selector: 'ssg-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, AfterContentInit, OnDestroy {

  title: string = 'Screensaver';
  bwTheme: boolean = false;
  OS: string = 'Unknown';

  private _backgroundColorSubscription: Subscription = new Subscription();

  constructor(
    private themeService: ThemeService,
    private localStorage: LocalStorageService,
    private siteInfoService: SiteInfoService,
    private colorService: ColorService,
    private appElm: ElementRef
  ){}

  ngOnInit(): void {
    // add os as class
    this.OS = this.getOS();
    this.appElm.nativeElement.setAttribute('id', this.OS.toLowerCase());
    // load site info
    this.siteInfoService.getSitInfo();
    // THEME
    this.themeService.bwTheme.subscribe((bw: boolean) => {
      this.bwTheme = bw;
    });
    const isSsgBw: string =  this.localStorage.getItem('ssgIsBw');
    if (isSsgBw !== null) { // item was previously saved
      // saved theme
      const isBw = (isSsgBw === 'true' ? true : false); // <= must be converted to boolean (storage store strings)
      this.themeService.setBwTo(Boolean(isBw));
    }
    // animate background color
    this._backgroundColorSubscription = this.colorService.animateRandomColor(5, 0, 30, 40, 1.0).subscribe({
      next: (hslaColor: string) => {
        // console.log('random color', hslaColor);
        this.appElm.nativeElement.style.backgroundColor = hslaColor;
      },
      error: (e: any) => console.log(e)
    });
  }

  ngAfterViewInit(): void {
    
  }

  ngAfterContentInit(): void {
    // const buttons = this.appElm.nativeElement.querySelectorAll('ssg-button.stroked');
    // console.log('buttons', buttons);
    // this.colorService.animateRandomColor(1, 0, 100, 70, 1.0).subscribe({
    //   next: (hslaColor: string) => {
    //     for (const button of buttons) {
    //       button.style.backgroundColor = hslaColor;
    //     }
    //   },
    //   error: (e: any) => console.log(e)
    // });
  }

  ngOnDestroy(): void {
    this.colorService.destroyAnimations();
    this._backgroundColorSubscription.unsubscribe();
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
    const app: string = navigator.appVersion;
    console.log('navigator.appVersion', navigator.appVersion);
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
