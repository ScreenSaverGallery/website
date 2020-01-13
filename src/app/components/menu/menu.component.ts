import { Component, OnInit } from '@angular/core';
// services
import { WpService } from '../../services/wp/wp.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  categories: any[];
  pages: any[];

  constructor(
    private wpService: WpService
  ) { }

  ngOnInit() {
    // subscribe categories
    this.wpService.categories.subscribe((res: any) => {
      if (res) {
        console.log('menu.component categories', res);
        this.categories = res;
      }
    });
    // subscribe pages
    this.wpService.pages.subscribe((res: any) => {
      if (res) {
        console.log('menu.component pages', res);
        this.pages = res;
      }
    });
  }

}
