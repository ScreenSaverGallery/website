import {
  Component,
  OnInit,
  Input,
  ElementRef,
  AfterViewInit,
  ViewChild
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
export class InfoSliderHorizontalComponent implements AfterViewInit {

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
