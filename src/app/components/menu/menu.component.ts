import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
// material
import { MatDrawer, MatDrawerContainer } from '@angular/material/sidenav';
import { Menu, Post, MenuItem } from '@tomaszatoo/ngx-wp-api';
// router
import { Router, NavigationEnd, RouterLink, RouterLinkActive } from '@angular/router';
// models
import { SocialMedium, followUs } from '../../models/social-medium';
// services
import { WpService } from '../../services/wp/wp.service';
import { ThemeService } from '../../services/theme/theme.service';
import { LinksService } from '../../services/links/links.service';
import { SiteInfoService } from '../../services/site-info/site-info.service';
import { ColorService } from 'src/app/services/color/color.service';
import { MenuService } from 'src/app/services/menu/menu.service';
// rxjs
import { Subscription } from 'rxjs';
import { SsgIconComponent } from '../ssg-icon/ssg-icon.component';
import { ButtonComponent } from '../button/button.component';
import { MatIcon } from '@angular/material/icon';
import { SearchComponent } from '../search/search.component';
import { LoadingComponent } from '../loading/loading.component';
import { SocialComponent } from '../social/social.component';
import { TitleCasePipe } from '@angular/common';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

interface MenuExtended extends Omit<Menu, 'items'> {
  items: MenuItemExtended[];
}

interface MenuItemExtended extends MenuItem {
  slug: string;
}



@Component({
    selector: 'ssg-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    standalone: true,
    imports: [
      SsgIconComponent,
      ButtonComponent,
      MatIcon,
      RouterLink,
      MatDrawerContainer,
      MatDrawer,
      SearchComponent,
      LoadingComponent,
      RouterLinkActive,
      SocialComponent,
      TitleCasePipe,
      SafeHtmlPipe
    ]
})
export class MenuComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('sandwitch') sandwitchElm: ElementRef;
  @ViewChild('drawer') drawer: MatDrawer;

  @Input() position: string = 'top-right';
  @Output() opened: EventEmitter<boolean> = new EventEmitter();

  // categories: any[];
  // pages: any[];

  categoriesMenu: MenuExtended | null = null;
  pagesMenu: MenuExtended | null = null;

  homePage: boolean = false;
  getPage: boolean = false;
  homeLink: string;
  currentShow: any;
  siteTitle: string;

  private routerSub: Subscription = new Subscription();

  followUs: SocialMedium[] = followUs;

  private _openedMenu: boolean = false;
  private _space: number = 24;

  private menuToggleSub: Subscription = new Subscription();


  constructor(
    private wpService: WpService,
    private router: Router,
    private themeService: ThemeService,
    private linksService: LinksService,
    private siteInfoService: SiteInfoService,
    private menuService: MenuService,
    private colorService: ColorService,
    private elm: ElementRef
  ) { }

  ngOnInit() {
    this.homeLink = this.linksService.homeLink;
    // home route
    this.routerSub = this.router.events.subscribe((res: any) => {
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
        // routerSub.unsubscribe();
      }
    });
    // site info
    const siteInfoSub: Subscription = this.siteInfoService.siteInfo.subscribe({
      next: (info: any) => {
        console.log('get siteInfo', info);
        if (info) {
          this.siteTitle = info.name;
          siteInfoSub.unsubscribe();
        }
      },
      error: (e: any) => {
        console.error(e);
        siteInfoSub.unsubscribe();
      }
    });
    // get name of last screensaver
    const lastCurrentSSSub: Subscription = this.wpService.getCurrentScreensaver().subscribe((posts: Post[]) => {
      this.currentShow = posts[0];
      lastCurrentSSSub.unsubscribe();
    });
    // get all pages and categories
    // this.wpService.getAllCategories();
    // this.wpService.getAllPages();
    // // subscribe categories
    // this.wpService.categories.subscribe((res: any) => {
    //   if (res) {
    //     this.categories = res;
    //   }
    // });
    // get menus
    // categories menu
    const categoriesMenuSub: Subscription = this.wpService.getMenuBySlug('categories').subscribe({
      next: (menu: Menu | null) => {
        // console.log('🐹🐹🐹🐹 get menu categories', menu);
        if (menu) this.categoriesMenu = menu as MenuExtended;
        categoriesMenuSub.unsubscribe();
      },
      error: (e: any) => {
        console.error(e);
        categoriesMenuSub.unsubscribe();
      }
    });
    // pages menu
    const pagesMenuSub: Subscription = this.wpService.getMenuBySlug('pages').subscribe({
      next: (menu: Menu | null) => {
        if (menu) this.pagesMenu = menu as MenuExtended;
        pagesMenuSub.unsubscribe();
      },
      error: (e: any) => {
        pagesMenuSub.unsubscribe();
      }
    })
    // subscribe pages
    // this.wpService.pages.subscribe((res: any) => {
    //   if (res) {
    //     this.pages = res;
    //   }
    // });
    // listen to menu actions
    this.menuToggleSub = this.menuService.toggle.subscribe(() => {
      this.toggleMenu(this.drawer.toggle());
    });
  }

  ngAfterViewInit() {
    this._positionOfSandwitch();
    // const buttons = this.elm.nativeElement.querySelectorAll('ssg-button');
    // console.log('buttons', buttons);
    // this.colorService.animateRandomColor(1, 0, 100, 70, 1.0).subscribe({
    //   next: (hslaColor: string) => {
    //     for (const button of buttons) {
    //       // button.style.backgroundColor = hslaColor;
    //       button.style.boxShadow = `0 0 24px ${hslaColor}`;
    //     }
    //   },
    //   error: (e: any) => console.log(e)
    // });

    // this._animateIcons();
  }

  ngOnDestroy(): void {
    this.menuToggleSub.unsubscribe();
    this.routerSub.unsubscribe();
  }

  goBack(): void {
    window.history.back();
  }

  toggleTheme(): void {
    this.themeService.toggleBW();
    // save to local storage
    localStorage.setItem('ssgIsBw', JSON.stringify(this.themeService.isBw()));
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
    // console.log('searchSelected', option);
    // console.log('slugFromUrl', this._slugFromUrl(option.url));
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
