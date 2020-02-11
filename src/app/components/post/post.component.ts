import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import { ActivatedRoute, UrlSegment, Router } from '@angular/router';
// services
import { WpService } from '../../services/wp/wp.service';
import { ColorService } from '../../services/color/color.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() post: any;
  loadedPost: any;

  randomColor: string = 'silver';

  constructor(
    private wpService: WpService,
    private route: ActivatedRoute,
    private router: Router,
    private colorService: ColorService
  ) { }

  ngOnInit() {

    this.randomColor = this.colorService.generateHslaColor(100);
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

}
