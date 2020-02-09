import { Component } from '@angular/core';
// services
// import { WpService } from './services/wp/wp.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ScreenSaverGallery';
  constructor(
    // private wpService: WpService
  ) {
    // this.wpService.getUsers();
    // this.wpService.getTags();
  }
}
