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
// import * as Warp from 'warpjs';
// services
import { WpService } from '../../services/wp/wp.service';
import { ThemeService } from '../../services/theme/theme.service';
import { LocalStorageService } from 'local-storage';
import { LinksService } from '../../services/links/links.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, AfterViewInit {

  @ViewChild('sandwitch', {static: false}) sandwitchElm: ElementRef;

  @Input() position: string = 'top-right';
  @Output() opened: EventEmitter<boolean> = new EventEmitter();

  categories: any[];
  pages: any[];
  home: boolean = false;
  downloadLink: string;
  private _openedMenu: boolean = false;
  private _space: number = 24;


  constructor(
    private wpService: WpService,
    private router: Router,
    private themeService: ThemeService,
    private localStorage: LocalStorageService,
    private linksService: LinksService,
    private menuElm: ElementRef
  ) { }

  ngOnInit() {
    this.downloadLink = this.linksService.downloadLink;
    // home route
    this.router.events.subscribe((res: any) => {
      // console.log('router res', res);
      if (res instanceof NavigationEnd) {
        if (res && res.url === '/') {
          this.home = true;
        } else {
          this.home = false;
        }
      }
      
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
