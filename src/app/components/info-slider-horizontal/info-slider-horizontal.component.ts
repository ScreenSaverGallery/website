import {
  Component,
  Output,
  Input,
  EventEmitter
} from '@angular/core';
import { RouterLink } from '@angular/router';

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
    styleUrl: './info-slider-horizontal.component.scss',
    standalone: true,
    imports: [RouterLink]
})
export class InfoSliderHorizontalComponent {

  @Input() sliderItems: SliderItem[] = [];

  @Input() set addItem(item: SliderItem) {
    console.log('addItem', item);
    if (item && !this._includesMessage(item, this.sliderItems)) {
      this.sliderItems.push(item);
      if (this.sliderItems.length === 1) {
        item.active = false;
      }
    }
  }

  @Input() set removeMessage(item: SliderItem) {
    if (item && this._includesMessage(item, this.sliderItems)) {
      this.sliderItems.splice(this._indexOfMessage(item, this.sliderItems), 1);
    }
  }

  @Output() selected: EventEmitter<SliderItem> = new EventEmitter();

  itemClicked(item: SliderItem): void {
    this.selected.emit(item);
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
