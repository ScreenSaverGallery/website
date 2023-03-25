import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Input,
  ElementRef,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, UrlSegment, Router } from '@angular/router';
// services
import { WpService } from '../../services/wp/wp.service';
import { ColorService } from '../../services/color/color.service';
import { ThemeService } from '../../services/theme/theme.service';
import { LinksService } from '../../services/links/links.service';

@Component({
  selector: 'ssg-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() post: any;
  @Input() highlighted: boolean = false;
  pinned: boolean = false;
  loadedPost: any;

  downloadLink: string;

  randomColor: string = 'silver';
  ssgIconColor: string = 'red';

  postClass: string = '';

  social: any[] = [
    {name: 'facebook', shortcut: 'fb', urlBase: 'https://facebook.com/sharer/sharer.php?u='},
    {name: 'twitter', shortcut: 't', urlBase: 'https://twitter.com/intent/tweet?text='}
  ];

  @ViewChild('featuredImage') featuredImgContainer: ElementRef;

  constructor(
    private wpService: WpService,
    private route: ActivatedRoute,
    private router: Router,
    private colorService: ColorService,
    private elm: ElementRef,
    private themeService: ThemeService,
    private linksService: LinksService
  ) { }

  ngOnInit() {
    // console.log('init post component post', this.post);
    this.downloadLink = this.linksService.downloadLink;
    // THEME
    this.themeService.bwTheme.subscribe((bw: boolean) => {
      if (bw) {
        // set random color
        this.randomColor = 'white';
        this.ssgIconColor = 'black';
      } else {
        this.randomColor = this.colorService.generateHslaColors(100)[0];
        this.ssgIconColor = 'red';
      }
      // console.log('theme changed', this.randomColor);
    });
    
    // higlight
    if (this.highlighted) {
      this.elm.nativeElement.classList.add('highlight');
    }
    if (this.pinned) {
      this.elm.nativeElement.classList.add('pinned');
    }
    // if not post, get it from url
    if (!this.post) {
      
      this.wpService.pages.subscribe((pages: any) => {
        if (pages) {
          // if is page
          this.route.url.subscribe((url: UrlSegment[]) => {
            // console.log('url changed');
            if (this.postClass) this.elm.nativeElement.classList.remove(this.postClass); // remove old class
            const slug: string = url[0].path;
            const page: any = this.wpService.getPageBySlug(slug);
            this.postClass = slug;
            this.elm.nativeElement.classList.add(this.postClass); // add new class
            // page
            if (page) {
              this.loadedPost = page;
              // console.log('post', this.loadedPost);
            } else { // page not exists, get post by slug
              // post
              this.wpService.getPostBySlug(slug).subscribe((res: any) => {
                // console.log('post by slug', res);
                if (res && res.body && res.body.length === 1) {
                  this.loadedPost = res.body[0];
                  // console.log('post', this.loadedPost);
                  // if (this.loadedPost['featured_media']) this.getFeautredImage(this.loadedPost['featured_media']);
                } else {
                  // navigate to 404
                  this.router.navigate(['/error/404']);
                }
              });
            }
          });
        }
      });
    } else {
      // post is set => listing posts
      // console.log('post is set', this.post);
    }
      
  }

  ngAfterViewInit(): void {
    // if (this.loadedPost) {
    //   console.log('loadedPost after view init', this.loadedPost);
    // }
  }

  ngOnDestroy(): void {
    // console.log('destroy post component');
    // if (this.postClass) this.elm.nativeElement.classList.remove(this.postClass);
  }

  

  getRefUrl(): string {
    return `${window.location.protocol}//${window.location.host}/${this.post.slug}`;
  }

  togglePin(): void {
    this.pinned = !this.pinned;
    this.elm.nativeElement.classList.toggle('pinned');
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
          }
          image.src = media.body.source_url;
        }
      },
      error: (e: any) => console.log(e)
    })
  }

}
