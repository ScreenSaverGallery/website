import { Component, OnInit } from '@angular/core';
// services
import { ColorService } from '../../services/color/color.service';
import { MenuService } from 'src/app/services/menu/menu.service';
import { NgStyle } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
    selector: 'ssg-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss'],
    standalone: true,
    imports: [NgStyle, ButtonComponent]
})
export class NotFoundComponent implements OnInit {

  randomColor: string = 'silver';

  constructor(
    private colorService: ColorService,
    private menuService: MenuService
  ) { } 

  ngOnInit() {
    this.randomColor = this.colorService.generateHslaColors(100)[0];
  }

  openMenu(): void {
    console.log('open menu');
    this.menuService.toggle.next(null);
  }

}
