import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ElementRef
} from '@angular/core';


@Component({
  selector: 'ssg-ssg-icon',
  templateUrl: './ssg-icon.component.html',
  styleUrls: ['./ssg-icon.component.scss']
})
export class SsgIconComponent implements OnInit, AfterViewInit {

  @Input() size: number = 100;
  @Input() animated: boolean = false;
  @Input() cursor: boolean = true;

  // flat or not flat change
  @Input() set flat( value: boolean ) {
    this._flat = value;
  };
  // flat color change
  @Input() set flatColor(value: string) {
    this._flatColor = value;
    this.setStyleToSvg();
  };

  @Input() title: string = 'ScreenSaverGallery';

  _flat: boolean;
  private _flatColor: string = 'silver';

  constructor(
    private elm: ElementRef,
  ) { }

  ngOnInit(): void {
    this.elm.nativeElement.style.width = `${this.size}px`;
    if (this.animated) {
      this.elm.nativeElement.classList.add('animated');
    }
    if (!this.cursor) this.elm.nativeElement.style.cursor = 'default';
  }

  ngAfterViewInit(): void {
    // this.setStyleToSvg();
  }

  setStyleToSvg(): void {
    if (this._flat) {
      const svgElms = this.elm.nativeElement.querySelectorAll('.cls-1');
      // console.log('svgElms', svgElms);
      for (let i = 0; i < svgElms.length; i++) {
        const elm = svgElms[i];
        elm.style.fill = this._flatColor;
      }      
    }
  }

}
