import {
  Component,
  OnInit,
  Input
} from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
// services
import { WpService } from '../../services/wp/wp.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() post: any;
  loadedPost: any;

  constructor(
    private wpService: WpService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

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
              this.wpService.getPostBySlug(slug).subscribe((posts: any) => {
                // console.log('post by slug', posts[0]);
                if (posts && posts.length === 1) {
                  this.loadedPost = posts[0];
                }
              });
            }
          });
        }
      });
    } else {
      // post is set => listing posts
    }
      
  }

}
