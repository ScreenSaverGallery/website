import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef
} from '@angular/core';
// router
import { Router, NavigationEnd } from '@angular/router';
// models
import { SocialMedium } from '../../models/social-medium';
// services
import { WpService } from '../../services/wp/wp.service';
import { ThemeService } from '../../services/theme/theme.service';
import { LocalStorageService } from 'local-storage';
import { LinksService } from '../../services/links/links.service';
import { SiteInfoService } from '../../services/site-info/site-info.service';


@Component({
  selector: 'ssg-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, AfterViewInit {

  @ViewChild('sandwitch', {static: false}) sandwitchElm: ElementRef;

  @Input() position: string = 'top-right';
  @Output() opened: EventEmitter<boolean> = new EventEmitter();

  categories: any[];
  pages: any[];
  homePage: boolean = false;
  getPage: boolean = false;
  homeLink: string;
  currentShow: any;
  siteTitle: string;

  followUs: SocialMedium[] = [
    {name: 'facebook', shortcut: 'fb', urlBase: 'https://www.facebook.com/ScreenSaverGallery'},
    {name: 'twitter', shortcut: 't', urlBase: 'https://twitter.com/ScreenSaverG'},
    {name: 'instagram', shortcut: 'i', urlBase: 'https://www.instagram.com/screensavergallery/'},
    {name: 'rss', shortcut: 'rss', urlBase: 'https://screensaver.metazoa.org/feed/'}
  ];

  private _openedMenu: boolean = false;
  private _space: number = 24;


  constructor(
    private wpService: WpService,
    private router: Router,
    private themeService: ThemeService,
    private localStorage: LocalStorageService,
    private linksService: LinksService,
    private siteInfoService: SiteInfoService
  ) { }

  ngOnInit() {
    this.homeLink = this.linksService.homeLink;
    // home route
    this.router.events.subscribe((res: any) => {
      if (res instanceof NavigationEnd) {
        // console.log('router res', res);
        if (res && res.url === '/') {
          this.homePage = true;
        } else {
          this.homePage = false;
        }

        if (res && res.url === '/get') {
          this.getPage = true;
          this.homeLink = this.linksService.homeLink;
        } else {
          this.getPage = false;
          this.homeLink = this.linksService.downloadLink;
        }
      }
    });
    // site info
    this.siteInfoService.siteInfo.subscribe((info: any) => {
      if (info) {
        this.siteTitle = info.name;
      }
    });
    // get name of last screensaver
    this.wpService.getCurrentScreensaver().subscribe((res: any) => {
      this.currentShow = res.body[0];
    });
    // get all pages and categories
    this.wpService.getAllCategories();
    this.wpService.getAllPages();
    // subscribe categories
    this.wpService.categories.subscribe((res: any) => {
      if (res) {
        this.categories = res;
      }
    });
    // subscribe pages
    this.wpService.pages.subscribe((res: any) => {
      if (res) {
        this.pages = res;
      }
    });
  }

  ngAfterViewInit() {
    this._positionOfSandwitch();
    // this._animateIcons();
  }

  goBack(): void {
    window.history.back();
  }

  toggleTheme(): void {
    this.themeService.toggleBW();
    // save to local storage
    this.localStorage.setItem('ssgIsBw', this.themeService.isBw());
  }


  toggleMenu(callback: any): void {
    // console.log('toggleMenu');
    this._openedMenu = !this._openedMenu;
    this.opened.emit(this._openedMenu);
  }

  closeMenu(callback: any): void {
    // console.log('closeMenu');
    this._openedMenu = false;
    this.opened.emit(this._openedMenu);
  }

  searchSelected(option: any, closeMenuCallback: any): void {
    // console.log('searchSelected this', this);
    console.log('searchSelected', option);
    console.log('slugFromUrl', this._slugFromUrl(option.url));
    this.router.navigate([this._slugFromUrl(option.url)]);
  }

  private _slugFromUrl(url: string): string {
    const domainRegExp = new RegExp('^(http|https)\:\/\/.+?(?=\/)');
    const slug = url.replace(domainRegExp, '');

    return slug;
  }


  private _positionOfSandwitch(): void {
    switch (this.position) {
      case 'top-right':
        this.sandwitchElm.nativeElement.style.top = `${this._space}px`;
        this.sandwitchElm.nativeElement.style.right = `${this._space}px`;
        break;
      case 'top-left':
        this.sandwitchElm.nativeElement.style.top = `${this._space}px`;
        this.sandwitchElm.nativeElement.style.left = `${this._space}px`;
        break;
      case 'bottom-left':
        this.sandwitchElm.nativeElement.style.bottom = `${this._space}px`;
        this.sandwitchElm.nativeElement.style.left = `${this._space}px`;
        break;
      case 'bottom-right':
        this.sandwitchElm.nativeElement.style.bottom = `${this._space}px`;
        this.sandwitchElm.nativeElement.style.right = `${this._space}px`;
        break;
      default:
        this.sandwitchElm.nativeElement.style.top = `${this._space}px`;
        this.sandwitchElm.nativeElement.style.right = `${this._space}px`;
        break;
    }
  }


}
