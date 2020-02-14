import {
  Component,
  OnInit,
  Input,
  ElementRef
} from '@angular/core';
import { ActivatedRoute, UrlSegment, Router } from '@angular/router';
// services
import { WpService } from '../../services/wp/wp.service';
import { ColorService } from '../../services/color/color.service';
import { ThemeService } from '../../services/theme/theme.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() post: any;
  @Input() highlighted: boolean = false;
  pinned: boolean = true;
  loadedPost: any;

  randomColor: string = 'silver';
  ssgIconColor: string = 'red';

  constructor(
    private wpService: WpService,
    private route: ActivatedRoute,
    private router: Router,
    private colorService: ColorService,
    private elm: ElementRef,
    private themeService: ThemeService
  ) { }

  ngOnInit() {
    this.themeService.bwTheme.subscribe((bw: boolean) => {
      if (bw) {
        // set random color
        this.randomColor = 'white';
        this.ssgIconColor = 'black';
      } else {
        this.randomColor = this.colorService.generateHslaColor(100);
        this.ssgIconColor = 'red';
      }
      // console.log('theme changed', this.randomColor);
    });
    
    // higlight
    if (this.highlighted) {
      this.elm.nativeElement.classList.add('highlight');
      this.elm.nativeElement.classList.add('pinned');
    }
    // if not post, get it from url
    if (!this.post) {
      
      this.wpService.pages.subscribe((pages: any) => {
        if (pages) {
          // if is page
          this.route.url.subscribe((url: UrlSegment[]) => {
            const slug: string = url[0].path;
            const page: any = this.wpService.getPageBySlug(slug);
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

  togglePin(): void {
    this.pinned = !this.pinned;
    this.elm.nativeElement.classList.toggle('pinned');
  }

}
