import { Component, OnInit } from '@angular/core';
// services
import { ColorService } from '../../services/color/color.service';
import { MenuService } from 'src/app/services/menu/menu.service';

@Component({
  selector: 'ssg-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
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
    this.menuService.toggle.next();
  }

}
