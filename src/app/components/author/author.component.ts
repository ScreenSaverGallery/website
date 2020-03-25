import { Component, OnInit, Input } from '@angular/core';
// services
import { WpService } from '../../services/wp/wp.service';

@Component({
  selector: 'ssg-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss']
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
      this.wpService.getUser(this.id).subscribe((res: any) => {
        if (res) {
          this.author = res;
        }
      });
    }
  }

}
