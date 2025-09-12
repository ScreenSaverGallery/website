import {
  Component,
  AfterViewInit,
  Output,
  Input,
  EventEmitter,
  ElementRef
} from '@angular/core';
import { LoadingComponent } from '../loading/loading.component';

@Component({
    selector: 'ssg-load-more',
    templateUrl: './load-more.component.html',
    styleUrls: ['./load-more.component.scss'],
    imports: [LoadingComponent]
})
export class LoadMoreComponent implements AfterViewInit {

  rect: any;
  visible: boolean = true;

  private _offset: number = 144;

  @Input() set loadMore(load: boolean) {
    if (!load) {
      this.visible = false;
    }
  }
  @Output() inViewport: EventEmitter<boolean> = new EventEmitter();


  constructor(
    private elm: ElementRef
  ) { }

  ngAfterViewInit() {
    window.addEventListener('scroll', (e: any) => {
      // console.log('isInViewPort', this.isInViewPort());
      if (this.isInViewPort() && this.visible) {
        this.inViewport.emit(true);
      } else {
        this.inViewport.emit(false);
      }
    });
  }

  private isInViewPort(): boolean {
    const rect = this.elm.nativeElement.getBoundingClientRect();
    // console.log('rect', rect);
    if (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + this._offset &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    ) {
      return true;
    }
    return false;
  }

}
