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
    // get all pages and categories
    this.wpService.getAllCategories();
    this.wpService.getAllPages();
    // subscribe categories
    this.wpService.categories.subscribe((res: any) => {
      if (res) {
        this.categories = res;
      }
    });
    // subscribe pages
    this.wpService.pages.subscribe((res: any) => {
      if (res) {
        this.pages = res;
      }
    });
  }

}
