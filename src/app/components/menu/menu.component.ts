import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ViewChild,
  ElementRef
} from '@angular/core';
// router
import { Router, NavigationEnd } from '@angular/router';
// services
import { WpService } from '../../services/wp/wp.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, AfterViewInit {

  @ViewChild('sandwitch', {static: false}) sandwitchElm: ElementRef;

  @Input() position: string = 'top-right';

  categories: any[];
  pages: any[];
  home: boolean = false;
  private _space: number = 24;


  constructor(
    private wpService: WpService,
    private router: Router
  ) { }

  ngOnInit() {
    // home route
    this.router.events.subscribe((res: any) => {
      // console.log('router res', res);
      if (res instanceof NavigationEnd) {
        if (res && res.url === '/') {
          this.home = true;
        } else {
          this.home = false;
        }
        // console.log('home', this.home);
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
  }

  goBack(): void {
    window.history.back();
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
