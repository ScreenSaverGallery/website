import { Component, OnInit, AfterViewInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
// services
import { WpService } from '../../services/wp/wp.service';
import { ThemeService } from '../../services/theme/theme.service';
import { LinksService } from '../../services/links/links.service';
import { SiteInfoService } from '../../services/site-info/site-info.service';
import { ColorService } from 'src/app/services/color/color.service';
// rxjs
import { Subscription } from 'rxjs';

interface Message {
  text: string,
  delay?: number,
  url?: string
}

@Component({
  selector: 'ssg-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {

  starsText: string;
  siteTitle: string = undefined;
  siteDescription: string;
  // infoMessages: Message[] = [];
  addMessage: Message = undefined;

  private _getSiteInfoSub: Subscription = new Subscription();
  private _getCurrentSaverSub: Subscription = new Subscription();

  @ViewChild('featuredImage') featuredImgContainer: ElementRef;

  constructor(
    private router: Router,
    private wpService: WpService,
    private themeService: ThemeService,
    private linksService: LinksService,
    private siteInfoService: SiteInfoService,
    private colorService: ColorService,
    private elm: ElementRef
  ) { }

  ngOnInit(): void {
    // get site info
    this._getSiteInfoSub = this.siteInfoService.siteInfo.subscribe((info: any) => {
      // console.log('site info', info);
      if (info) {
        this.siteTitle = info.name;
        // this.siteDescription = info.description;
        const descriptionMessage: Message = {
          text: `${info.description}`,
          delay: 4000
        };
        this.addMessage = descriptionMessage;
      }
      // get name of last screensaver
      this._getCurrentSaverSub = this.wpService.getCurrentScreensaver().subscribe((res: any) => {
        // this.starsText = res.body[0].title.rendered;
        // console.log('res.body', res.body);
        if (res.body[0] && res.body[0].featured_media) {
          // console.log('res.body', res.body[0]);
          this.getFeautredImage(res.body[0].featured_media);
        }
        const currentShowMessage: Message = {
          text: `Current Show: ${res.body[0].title.rendered}`,
          delay: 10000,
          url: res.body[0].slug
        }
        this.addMessage = currentShowMessage;
      });
    });
  }

  ngAfterViewInit(): void {
    // const buttons = this.elm.nativeElement.querySelectorAll('ssg-button');
    // console.log('buttons', buttons);
    // this.colorService.animateRandomColor(1, 0, 100, 70, 1.0).subscribe({
    //   next: (hslaColor: string) => {
    //     for (const button of buttons) {
    //       // button.style.backgroundColor = hslaColor;
    //       button.style.boxShadow = `0 0 24px ${hslaColor}`;
    //     }
    //   },
    //   error: (e: any) => console.log(e)
    // });
  }

  ngOnDestroy(): void {
    this._getCurrentSaverSub.unsubscribe();
    this._getSiteInfoSub.unsubscribe();
  }

  goToDownload(): void {
    this.router.navigate([this.linksService.downloadLink]);
  }

  themeIsBw(): boolean {
    return this.themeService.isBw();
  }

  private getFeautredImage(id: number): void {
    // console.log('getFeaturedImage', id);
    // console.log('featuredImage child', this.featuredImgContainer);
    this.wpService.getMedia(id).subscribe({
      next: (media: any) => {
        // console.log('recieved media', media);
        if (media.body && media.body.source_url) {
          const image = new Image();
          image.onload = () => {
            this.featuredImgContainer.nativeElement.style.backgroundImage = `url(${image.src})`;
            setTimeout(() => {
              this.featuredImgContainer.nativeElement.classList.add('fadeInFromNone');
            }, 1000);
          }
          setTimeout(function(){
            image.src = media.body.source_url;         
        }, 100);
          
        }
      },
      error: (e: any) => console.log(e)
    })
  }

}
