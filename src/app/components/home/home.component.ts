import { Component, OnInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
// models
import { SocialMedium } from '../../models/social-medium';
import { SliderItem } from '../info-slider/info-slider.component';
// services
import { WpService } from '../../services/wp/wp.service';
import { ThemeService } from '../../services/theme/theme.service';
import { LinksService } from '../../services/links/links.service';
import { SiteInfoService } from '../../services/site-info/site-info.service';
// rxjs
import { Subscription } from 'rxjs';
import { Post, Media } from '@tomaszatoo/ngx-wp-api';
import { ButtonComponent } from '../button/button.component';

@Component({
    selector: 'ssg-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [RouterLink, ButtonComponent]
})
export class HomeComponent implements OnInit, OnDestroy {

  starsText: string;
  siteTitle: string = undefined;
  siteDescriptions: string[];
  siteDescription: string = '';
  // infoMessages: Message[] = [];
  // addSliderItem: SliderItem = undefined;

  followUs: SocialMedium[] = [
    // {name: 'signal', shortcut: 'signal', urlBase: 'https://signal.group/#CjQKIHzeKjxDhPsOkmyVBuDyY4UfRo5aboltmuM6_DvKTmquEhD75Gre_8iJg4UB7zW6AhMY'},
    {name: 'mastodon', shortcut: 'mastodon', urlBase: 'https://tldr.nettime.org/@screensavergallery'},
    {name: 'telegram', shortcut: 'tlgrm', urlBase: 'https://t.me/screensavergallery'},
    {name: 'matrix', shortcut: 'matrix', urlBase: 'https://matrix.to/#/#screensaver.gallery:matrix.org'},
    // {name: 'discord', shortcut: 'dc', urlBase: 'https://discord.gg/QJtRUYptRR'},
    {name: 'rss', shortcut: 'rss', urlBase: 'https://sleep.screensaver.gallery/feed/'},
    // {name: 'X', shortcut: 'x', urlBase: 'https://twitter.com/ScreenSaverG'},
    {name: 'instagram', shortcut: 'i', urlBase: 'https://www.instagram.com/screensavergallery/'},
    {name: 'facebook', shortcut: 'fb', urlBase: 'https://www.facebook.com/ScreenSaverGallery'},
    {name: 'github', shortcut: 'git', urlBase: 'https://github.com/ScreenSaverGallery'},
    {name: 'newsletter', shortcut: 'monk', urlBase: 'https://listmonk.screensaver.gallery/subscription/form'}
  ];

  private _getSiteInfoSub: Subscription = new Subscription();
  private _getCurrentSaverSub: Subscription = new Subscription();
  // private _getCurrentOfflineSaverSub: Subscription = new Subscription();
  // private _getLastNewsSub: Subscription = new Subscription();

  @ViewChild('featuredImage') featuredImgContainer: ElementRef;
  @ViewChild('waving') wavingElm!: ElementRef;

  constructor(
    private router: Router,
    private wpService: WpService,
    private themeService: ThemeService,
    private linksService: LinksService,
    private siteInfoService: SiteInfoService
  ) { }

  ngOnInit(): void {
    // get site info, current online/offline shows
    this._getSiteInfoSub = this.siteInfoService.siteInfo.subscribe({
      next: (info: any) => {
        // console.log('site info', info);
        if (info) {
          this.siteTitle = info.name;
          this.siteDescriptions = info.description.split('; ');
          console.log('siteDescriptions', this.siteDescriptions);
          if (this.siteDescriptions.length) {
            this.siteDescription = this.chooseRandomHeadline(this.siteDescriptions);
          }
          setTimeout(() => {
            // console.log('waving elm', this.wavingElm);
            if (this.wavingElm) {
              const delay = 200;
              const dom = this.wavingElm.nativeElement;
              dom.innerHTML = dom.innerText.split('')
              .map((char: string) => {
                return `<span>${char === ' ' ? '&nbsp;' : char}</span>`;
              })
              .join('');

              Array.from(this.wavingElm.nativeElement.children).forEach((span: HTMLElement, index: number) => {
                setTimeout(() => {
                  span.classList.add("wavy");
                }, index * 60 + delay);
              })
            }
          }, 100);
          
        }
        this._getSiteInfoSub.unsubscribe();
      },
      error: (e: any) => console.error(e)
    });

    // // get name of last screensaver
    this._getCurrentSaverSub = this.wpService.getCurrentScreensaver().subscribe({
      next: (posts: Post[]) => {
        // this.starsText = res.body[0].title.rendered;
        // console.log('res.body', res.body);
        if (posts && posts.length) {
          const post = posts[0];
          if (post.featured_media) {
            // console.log('res.body', res.body[0]);
            this.getFeautredImage(post.featured_media);
          }
          // const currentShow: SliderItem = {
          //   emoji: 'Online Now ',
          //   text: post.title.rendered,
          //   // delay: 10000,
          //   url: post.slug
          // }
          // this.addSliderItem = currentShow;
        }

        this._getCurrentSaverSub.unsubscribe();
      },
      error: (e: any) => console.error(e)
    });
// 
    // // get name of last offline screensaver
    // this._getCurrentOfflineSaverSub = this.wpService.getCurrentOfflineScreensaver().subscribe({
    //   next: (posts: Post[]) => {
    //     if (posts.length) {
    //       const post = posts[0];
    //       const currentOfflineShow: SliderItem = {
    //         emoji: '🪷 Offline Now ',
    //         text: post.title.rendered,
    //         // delay: 10000,
    //         url: post.slug
    //       }
    //       this.addSliderItem = currentOfflineShow;
    //     }
    //     this._getCurrentOfflineSaverSub.unsubscribe();
    //   },
    //   error: (e: any) => console.error(e)        
    // });
// 
    // /* TODO: hot 🔥NEWS🔥 to slider */
    // /* 2 month news (60 days) */
    // // https://developer.wordpress.org/rest-api/reference/posts/
    // const today = Date.now();
    // const period = 60 * (24 * 60 * 60 * 1000); // set to 60 days
    // const queryDate = new Date(today - period).toISOString();
    // console.log('🔥 NEWS 🔥 queryDate', queryDate);
    // this._getLastNewsSub = this.wpService.getPosts(`categories=1&orderby=date&per_page=2&after=${queryDate}`).subscribe({
    //   next: (posts: Post[]) => {
    //     if (posts.length) {
    //       console.log('NEWS res', posts);
    //       for (let i = 0; i < posts.length; i++) {
    //         const news = posts[i];
    //         const message: SliderItem = {
    //           emoji: '🐣 Hot News ', // '🦑 🐣 🐍',
    //           text: news.title.rendered,
    //           // delay: 10000,
    //           url: news.slug
    //         }
    //         // slower adding
    //         setTimeout(() => this.addSliderItem = message, i * 100);
    //       }
    //     }
// 
    //     this._getLastNewsSub.unsubscribe();
    //   },
    //   error: (e: any) => console.error(e)
    // });
    
  }

  ngOnDestroy(): void {
    // this._getCurrentSaverSub.unsubscribe();
    // this._getCurrentOfflineSaverSub.unsubscribe();
    this._getSiteInfoSub.unsubscribe();
    // this._getLastNewsSub.unsubscribe();
  }

  goToDownload(): void {
    this.router.navigate([this.linksService.downloadLink]);
  }

  themeIsBw(): boolean {
    return this.themeService.isBw();
  }

  setWavy(event: any): void {
    console.log('setWavy', event);
  }

  chooseRandomHeadline(descriptions: string[]): string {
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private getFeautredImage(id: number): void {
    // console.log('getFeaturedImage', id);
    // console.log('featuredImage child', this.featuredImgContainer);
    const getMediaSub: Subscription = this.wpService.getMedia(id).subscribe({
      next: (media: Media) => {
        // console.log('recieved media', media);
        if (media && media.source_url) {
          const image = new Image();
          image.onload = () => {
            this.featuredImgContainer.nativeElement.style.backgroundImage = `url(${image.src})`;
            setTimeout(() => {
              this.featuredImgContainer.nativeElement.classList.add('fadeInFromNone');
            }, 1000);
          }
          setTimeout(function(){
            image.src = media.source_url;         
        }, 100);
          
        }
        getMediaSub.unsubscribe();
      },
      error: (e: any) => console.log(e)
    })
  }

}
