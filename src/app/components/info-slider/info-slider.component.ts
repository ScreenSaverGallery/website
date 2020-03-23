import {
  Component,
  OnInit,
  Input,
  ElementRef,
  AfterViewInit
} from '@angular/core';

interface Message {
  text: string,
  delay?: number,
  url?: string
} 

@Component({
  selector: 'ssg-info-slider',
  templateUrl: './info-slider.component.html',
  styleUrls: ['./info-slider.component.scss']
})
export class InfoSliderComponent implements OnInit, AfterViewInit {

  @Input() messages: Message[] = [];
  
  @Input() set addMessage(message: Message) {
    if (message && !this._includesMessage(message, this.messages)) {
      this.messages.push(message);
      // console.log('viewInit on push message', this.viewInit);
      if (!this.sliderStart) {
        setTimeout(() => {
          this.slider();
        }, 400);
        this.sliderStart = true;
      }
    }
  }
  @Input() set removeMessage(message: Message) {
    if (message && this._includesMessage(message, this.messages)) {
      this.messages.splice(this._indexOfMessage(message, this.messages), 1);
      // this.messages.splice(this.messages.indexOf(message), 1);
    }
  }

  @Input() delay: number = 5000; // default
  @Input() align: string = 'left'; // default

  sliderStart: boolean = false;
  slideIndex: number = 0;
  prevSlideIndex: number = null;
  viewInit: boolean = false;

  private _pausedSlider: boolean = false;
  private _sliderMouseListen: boolean = false;

  constructor(
    private elm: ElementRef
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.viewInit = true;
  }

  slider(): void {

    const message: Message = this.messages[this.slideIndex];
    const sliderContainer: HTMLElement = this.elm.nativeElement.querySelector('.slider-container');
    const slide: HTMLElement = this.elm.nativeElement.querySelector(`#m-${this.slideIndex}`);
    const prevSlide: HTMLElement = this.prevSlideIndex != null ? this.elm.nativeElement.querySelector(`#m-${this.prevSlideIndex}`) : null;
    const slides: NodeList = this.elm.nativeElement.querySelectorAll('.message');

    if (!this._sliderMouseListen) {
      sliderContainer.addEventListener('mouseover', () => {
        this._pausedSlider = true;
      });
      sliderContainer.addEventListener('mouseout', () => {
        this._pausedSlider = false;
      });
      this._sliderMouseListen = true;
    }

    if (!this._pausedSlider) {
      // set text align to container
      sliderContainer.style.textAlign = this.align;

      // add leaving class to previously active
      if (prevSlide && prevSlide.classList.contains('active')) prevSlide.classList.add('leaving'); 
      
      slides.forEach((s: HTMLElement) => {
        s.classList.remove('active');
        if (s !== prevSlide) s.classList.remove('leaving');
        // s.classList.remove('leaving');
        // set slider max width
        const sliderContainerRect: any = sliderContainer.getBoundingClientRect();
        const sliderContainerWidth: number = sliderContainerRect.width;
        const sliderContainerHeight: number = sliderContainerRect.height;
        const slideRect: any = s.getBoundingClientRect();
        const slideWidth: number = slideRect.width;
        const slideHeight: number = slideRect.height;

        if (slideWidth > sliderContainerWidth) {
          sliderContainer.style.width = `${slideWidth}px`;
          // sliderContainer.style.height = `${slideHeight}px`;
        }

        if (slideHeight > sliderContainerHeight) {
          sliderContainer.style.height = `${slideHeight}px`;
        }

      });

      // if (prevSlide) prevSlide.classList.add('leaving');
      slide.classList.add('active');
      // set index for next slide
      this.prevSlideIndex = this.slideIndex;
      this.slideIndex++;
      if (this.slideIndex >= this.messages.length) this.slideIndex = 0; // loop
    } // else do nothing (slider paused)
    

    setTimeout(() => {
      this.slider(); // recursion
    }, message.delay ? message.delay : this.delay);
  }

  private _includesMessage(message: Message, messages: Message[]): boolean {
    for (let i = 0; i < messages.length; i++) {
      if (JSON.stringify(message) === JSON.stringify(messages[i])) return true;
    }
    return false;
  }

  private _indexOfMessage(message: Message, messages: Message[]): number {
    for (let i = 0; i < messages.length; i++) {
      if (JSON.stringify(message) === JSON.stringify(messages[i])) return i;
    }
    return -1;
  }

}
