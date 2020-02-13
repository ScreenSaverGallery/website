import {
  Component,
  OnInit,
  AfterViewInit,
  Input,
  ElementRef
} from '@angular/core';

@Component({
  selector: 'app-ssg-icon',
  templateUrl: './ssg-icon.component.html',
  styleUrls: ['./ssg-icon.component.scss']
})
export class SsgIconComponent implements OnInit, AfterViewInit {

  @Input() size: number = 100;
  @Input() animated: boolean = false;
  @Input() flat: boolean = false;
  @Input() flatColor: string = 'white';

  flatStyle: string;

  constructor(
    private elm: ElementRef
  ) { }

  ngOnInit(): void {
    this.elm.nativeElement.style.width = `${this.size}px`;
    if (this.animated) {
      this.elm.nativeElement.classList.add('animated');
    }
    // console.log('flatColor', this.flatColor);
    this.flatStyle = `.cls-1{fill:${this.flatColor}}`;
  }

  ngAfterViewInit(): void {
    if (this.flat) {
      const svgElms = this.elm.nativeElement.querySelectorAll('.cls-1');
      // console.log('svgElms', svgElms);
      for (let i = 0; i < svgElms.length; i++) {
        const elm = svgElms[i];
        elm.style.fill = this.flatColor;
      }
    }
  }

}
