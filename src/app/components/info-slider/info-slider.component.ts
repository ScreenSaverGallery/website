import {
  Component,
  OnInit,
  Input,
  ElementRef,
  AfterViewInit,
  ViewChild
} from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

export interface SliderItem {
  text: string,
  emoji?: string,
  delay?: number,
  url?: string,
  active?: boolean,
  leaving?: boolean
} 

@Component({
    selector: 'ssg-info-slider',
    templateUrl: './info-slider.component.html',
    styleUrls: ['./info-slider.component.scss'],
    imports: [NgClass, RouterLink, SafeHtmlPipe]
})
export class InfoSliderComponent implements OnInit, AfterViewInit {

  @Input() sliderItems: SliderItem[] = [];
  
  @Input() set addItem(item: SliderItem) {
    console.log('addItem', item);
    if (item && !this._includesMessage(item, this.sliderItems)) {
      this.sliderItems.push(item);
      if (this.sliderItems.length === 1) {
        item.active = false;
      }
      this._justifySliderHeight();
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

  // sliderStart: boolean = false;
  slideIndex: number = 0;
  prevSlideIndex: number = null;
  // viewInit: boolean = false;

  private _activeSlideTime: number = 0;
  private _pausedSlider: boolean = false;
  // private _sliderMouseListen: boolean = false;
  // private _slides: NodeList;

  constructor(
    private elm: ElementRef
  ) { }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    window.addEventListener('resize', (e: any) => {
      this._justifySliderHeight();
    });
    if (this._sliderContainer) {
      const container = this._sliderContainer.nativeElement;
      // styles
      container.style.textAlign = this.align;
      // listeners
      container.addEventListener('mouseover', () => {
        this._pausedSlider = true;
      });
      container.addEventListener('mouseout', () => {
        this._pausedSlider = false;
      });
      this._justifySliderHeight();
      // start slider
      this.slide();
    }
    // this.viewInit = true;
  }

  slide(): void {
    if (this._sliderContainer) {
      // const container = this._sliderContainer.nativeElement;      
      if (this.sliderItems.length && this.sliderItems.length > 1) {

        const slideMessage = this.sliderItems[this.slideIndex];
        const slideTime = slideMessage.delay ? slideMessage.delay : this.delay;
        
        // set active current slide if not already
        if (!slideMessage.active) {
          // justify container first
          this._justifySliderHeight();
          slideMessage.leaving = false;
          slideMessage.active = true;
        }

        // do not count slide time if paused
        if (!this._pausedSlider) this._activeSlideTime++;

        // slide time ended / next slide, refresh time
        if (this._activeSlideTime >= slideTime) {
          // remove leaving in previously leaving slider
          const prevSlideMessage = this.sliderItems[this.slideIndex - 1 >= 0 ? this.slideIndex - 1 : this.sliderItems.length - 1];
          prevSlideMessage.leaving = false;
          // set this slide to leave
          slideMessage.leaving = true;
          // set this slide to not active
          slideMessage.active = false;
          // next slide
          this.slideIndex++;
          if (this.slideIndex === this.sliderItems.length) this.slideIndex = 0; // carousel
          // refresh time
          this._activeSlideTime = 0;
        }
        
      }
      // basic loop
      requestAnimationFrame(this.slide.bind(this));

    } // else do nothing (slider paused)
  }

  private _justifySliderHeight(): void {
    if (this._sliderContainer) {
      console.log('_justifySliderHeight');
      const container = this._sliderContainer.nativeElement;
      // get slides
      const slides = container.querySelectorAll('.item');

      let highestHeight: number = 0;

      slides.forEach((slide: HTMLElement) => {
        const h = slide.getBoundingClientRect().height;
        if (h > highestHeight) highestHeight = h;
      });

      // if (slideHeight > sliderContainerHeight) {
      container.style.height = `${highestHeight}px`;
      // }
      // set height to every child of container
      slides.forEach((slide: HTMLElement) => {
        slide.style.height = `${highestHeight}px`;
      });
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
