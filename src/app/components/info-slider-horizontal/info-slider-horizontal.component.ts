import {
  Component,
  OnInit,
  Input,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnDestroy
} from '@angular/core';

export interface SliderItem {
  text: string,
  emoji?: string,
  delay?: number,
  url?: string,
  active?: boolean,
  leaving?: boolean
} 

@Component({
  selector: 'ssg-info-slider-horizontal',
  templateUrl: './info-slider-horizontal.component.html',
  styleUrl: './info-slider-horizontal.component.scss'
})
export class InfoSliderHorizontalComponent implements AfterViewInit, OnDestroy {

  @Input() sliderItems: SliderItem[] = [];
  
  @Input() set addItem(item: SliderItem) {
    console.log('addItem', item);
    if (item && !this._includesMessage(item, this.sliderItems)) {
      this.sliderItems.push(item);
      if (this.sliderItems.length === 1) {
        item.active = false;
      }
      // this._justifySliderHeight();
    }
  }
  @Input() set removeMessage(item: SliderItem) {
    if (item && this._includesMessage(item, this.sliderItems)) {
      this.sliderItems.splice(this._indexOfMessage(item, this.sliderItems), 1);
      // this.sliderItems.splice(this.sliderItems.indexOf(item), 1);
    }
  }

  @Input() delay: number = 500; // default
  @Input() align: string = 'left'; // default

  @ViewChild('sliderContainer') _sliderContainer!: ElementRef;

  private _activeSlideTime: number = 0;
  private _pausedSlider: boolean = false;

  constructor(
    private elm: ElementRef
  ) { }

  ngAfterViewInit(): void {
    if (this._sliderContainer) {
      console.log('SLIDER CONTAINER', this._sliderContainer);
      let t = 0;
      const e = this._sliderContainer.nativeElement;
      const animate = () => {
        const rect = e.getBoundingClientRect();
        // console.log('animate e', e);
        // console.log('animate val', val);
        if (e.classList.contains('active')) {
          e.style.transform = `translateX(${t}px)`;
          t -= .8;
          if (Math.abs(t) > (rect.width + this.elm.nativeElement.getBoundingClientRect().width)) {
            t = 0;
          }
        }
        requestAnimationFrame(animate);
      }
      // start loop
      requestAnimationFrame(animate);
      this.elm.nativeElement.addEventListener('mouseenter', this.onEnter.bind(this), true);
      this.elm.nativeElement.addEventListener('mouseout', this.onOut.bind(this), true);
    }
  }

  private onEnter(): void {
    if (this._sliderContainer) this._sliderContainer.nativeElement.classList.remove('active');
  }

  private onOut(): void {
    if (this._sliderContainer) this._sliderContainer.nativeElement.classList.add('active');
  }

  ngOnDestroy(): void {
    if (this.elm) {
      this.elm.nativeElement.removeEventListener('mouseenter')
    }
  }

  private _includesMessage(item: SliderItem, messages: SliderItem[]): boolean {
    for (let i = 0; i < messages.length; i++) {
      if (JSON.stringify(item) === JSON.stringify(messages[i])) return true;
    }
    return false;
  }

  private _indexOfMessage(item: SliderItem, messages: SliderItem[]): number {
    for (let i = 0; i < messages.length; i++) {
      if (JSON.stringify(item) === JSON.stringify(messages[i])) return i;
    }
    return -1;
  }


}
