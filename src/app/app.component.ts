import { Component } from '@angular/core';
// services
import { WpService } from './services/wp/wp.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'web';
  constructor(
    private wpService: WpService
  ) {
    this.wpService.getCategories();
    this.wpService.getPages();
    this.wpService.getUsers();
    this.wpService.getTags();
  }
}
