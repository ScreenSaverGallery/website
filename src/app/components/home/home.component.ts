import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// services
import { WpService } from '../../services/wp/wp.service';
import { ThemeService } from '../../services/theme/theme.service';
import { LinksService } from '../../services/links/links.service';
import { SiteInfoService } from '../../services/site-info/site-info.service';

interface Message {
  text: string,
  delay?: number,
  url?: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  starsText: string;
  siteTitle: string = undefined;
  siteDescription: string;
  // infoMessages: Message[] = [];
  addMessage: Message = undefined;

  constructor(
    private router: Router,
    private wpService: WpService,
    private themeService: ThemeService,
    private linksService: LinksService,
    private siteInfoService: SiteInfoService
  ) { }

  ngOnInit(): void {
    // get site info
    this.siteInfoService.siteInfo.subscribe((info: any) => {
      // console.log('site info', info);
      if (info) {
        this.siteTitle = info.name;
        // this.siteDescription = info.description;
        const descriptionMessage: Message = {
          text: `${info.name}: ${info.description}`,
          delay: 4000
        };
        this.addMessage = descriptionMessage;
      }
      // get name of last screensaver
      this.wpService.getCurrentScreensaver().subscribe((res: any) => {
        // this.starsText = res.body[0].title.rendered;
        const currentShowMessage: Message = {
          text: `Current Show: ${res.body[0].title.rendered}`,
          delay: 10000,
          url: res.body[0].slug
        }
        this.addMessage = currentShowMessage;
      });
    });

  }

  goToDownload(): void {
    this.router.navigate([this.linksService.downloadLink]);
  }

  themeIsBw(): boolean {
    return this.themeService.isBw();
  }

}
