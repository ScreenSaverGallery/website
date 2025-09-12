import { Component, OnInit, Input } from '@angular/core';
import { User } from '@tomaszatoo/ngx-wp-api';
// services
import { WpService } from '../../services/wp/wp.service';
// rxjs
import { Subscription } from 'rxjs';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

@Component({
    selector: 'ssg-author',
    templateUrl: './author.component.html',
    styleUrls: ['./author.component.scss'],
    imports: [NgIf, RouterLink, SafeHtmlPipe]
})
export class AuthorComponent implements OnInit {

  @Input() id: number;
  @Input() text: string = undefined;
  author: any;

  constructor(
    private wpService: WpService
  ) { }

  ngOnInit() {
    if (this.id) {
      const getUserSub: Subscription = this.wpService.getUser(this.id).subscribe((user: User) => {
        if (user) {
          this.author = user;
        }
        getUserSub.unsubscribe();
      });
    }
  }

}
