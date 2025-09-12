import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ElementRef,
  ViewChild,
  OnDestroy
  // Directive
} from '@angular/core';

// services
import { ThemeService } from '../../services/theme/theme.service';
import { ColorService } from 'src/app/services/color/color.service';
// rxjs
import { Subscription } from 'rxjs';

/* @Directive({
  selector: 'ssg-icon-button'
})

export class SsgIconButton {
  constructor(private elm: ElementRef) {

  }
} */

@Component({
    selector: 'ssg-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    standalone: true
})
export class ButtonComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() dark: boolean = true;
  @Input() type: string =  undefined; // default undefined, types: stroked, icon
  @Input() colors: string[] = new Array(3);
  @Input() badge: number = 0;
  // @Input() skew: boolean = false;

  private _colors: string[];
  private _animateColorSubscription: Subscription = new Subscription();

  get width(): number {
    return this.contentElm.nativeElement.getBoundingClientRect().width;
  }

  get height(): number {
    return this.contentElm.nativeElement.getBoundingClientRect().height;
  }

  @ViewChild('content', {static: false}) contentElm: ElementRef;

  constructor(
    // private themeService: ThemeService,
    // private colorService: ColorService,
    private elm: ElementRef
  ) { }

  ngOnInit(): void {
    this._colors = this.colors.map(color => color);
    // if (this.skew) this.elm.nativeElement.classList.add('skew');
    // console.log('colors', this._colors);
  }

  ngAfterViewInit(): void {
    // this._inheritColorsFromBody();
    this._applyStyles();
    
    // this.themeService.bwTheme.subscribe((res: any) => {
    //   this._applyStyles();
    // });

    // if (this.type === 'stroked') {
    //   this._animateColorSubscription = this.colorService.animateRandomColor(1, this._randomFromTo(0, 100), 100, 70, 1.0).subscribe({
    //     next: (hslaColor: string) => {
    //       this.elm.nativeElement.style.boxShadow = `0 0 24px ${hslaColor}`;
    //       this.elm.nativeElement.style.color = hslaColor;
    //     },
    //     error: (e: any) => console.log(e)
    //   });
    // }
  }

  ngOnDestroy(): void {
    this._animateColorSubscription.unsubscribe();
  }

  private _applyStyles(): void {
    setTimeout(() => {
      this._inheritColorsFromBody(() => {
        this._setStyles();
      })
    }, 100);
  }

  private _setStyles(): void {
    const content: HTMLElement = this.contentElm.nativeElement;
    const button: HTMLElement = this.elm.nativeElement;
    button.style.display = 'inline-block';

    button.classList.remove('stroked');
    button.classList.remove('icon');

    if (this.dark) {
      // console.log('type', this.type);
      if (this.type === 'stroked') {
        button.classList.add('stroked');
        // button.style.borderColor = this._colors[0];
        // content.style.color = this._colors[0];
        // content.style.textShadow = `0px 5px 15px ${this._colors[3]}`;

      } else if (this.type === 'icon') {
        button.classList.add('icon');
        // content.style.color = this._colors[0];
        // button.style.width = `${this.height}px`;
        // console.log('color3', this._colors[3]);
        // content.style.textShadow = `0px 5px 15px ${this._colors[3]}`;
      } else {
        button.style.backgroundColor = this._colors[0];
        content.style.color = this._colors[1];
      }
    } else {
      // TODO
      // content.style.backgroundColor = this.colors[1];
      // content.style.color = this.colors[0];
      // content.style.borderColor = this.colors[1];
      // if (this.type === 'stroked') {
      //   content.style.backgroundColor = 'transparent';
      //   content.style.color = this.colors[1];
      // }
    }
  }

  private _inheritColorsFromBody(callback: any = () => {}): void {
    // const body: HTMLElement = this.renderer.selectRootElement('ssg-root');
    const root: HTMLElement = document.querySelector('ssg-root');
    const link: HTMLElement = document.querySelector('a');

    const rootStyle: any = root ? window.getComputedStyle(root) : {};
    const linkStyle: any = link ? window.getComputedStyle(link) : {};

    // console.log(linkStyle);

    if (!this.colors[0] && rootStyle.color) {
      this._colors[0] = rootStyle.color;
    }
    
    if (!this.colors[1] && rootStyle.backgroundColor) {
      this._colors[1] = rootStyle.backgroundColor;
    }   
    
    if (!this.colors[3] && linkStyle.color) {
      // console.log('linkStyle.color', linkStyle.color);
      this._colors[3] = linkStyle.color;
    }

    callback();
  }

  private _randomFromTo(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
