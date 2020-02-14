import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// services
import { WpService } from '../../services/wp/wp.service';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  starsText: string;

  constructor(
    private router: Router,
    private wpService: WpService,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    // get name of last screensaver
    this.wpService.getPosts('category=screensavers&orderby=date&per_page=1').subscribe((res: any) => {
      this.starsText = res.body[0].title.rendered;
    });

  }

  goToDownload(): void {
    this.router.navigate(['/download']);
  }

  themeIsBw(): boolean {
    return this.themeService.isBw();
  }

}
