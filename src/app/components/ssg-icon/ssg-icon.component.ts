import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'app-ssg-icon',
  templateUrl: './ssg-icon.component.html',
  styleUrls: ['./ssg-icon.component.scss']
})
export class SsgIconComponent implements OnInit {

  @Input() size: number = 100;
  @Input() animated: boolean = false;

  constructor(
    private elm: ElementRef
  ) { }

  ngOnInit(): void {
    this.elm.nativeElement.style.width = `${this.size}px`;
    if (this.animated) {
      this.elm.nativeElement.classList.add('animated');
    }
  }

}
