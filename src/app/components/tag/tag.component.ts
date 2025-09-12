import {
  Component,
  OnInit,
  Input,
  OnDestroy
} from '@angular/core';
import { Tag } from '@tomaszatoo/ngx-wp-api';
// services
import { WpService } from '../../services/wp/wp.service';
import { ColorService } from '../../services/color/color.service';
// import { ThemeService } from '../../services/theme/theme.service';
// rxjs
import { Subscription } from 'rxjs';
import { RouterLink } from '@angular/router';
import { NgStyle, LowerCasePipe } from '@angular/common';

@Component({
    selector: 'ssg-tag',
    templateUrl: './tag.component.html',
    styleUrls: ['./tag.component.scss'],
    standalone: true,
    imports: [RouterLink, NgStyle, LowerCasePipe]
})
export class TagComponent implements OnInit, OnDestroy {

  @Input() id: number;
  @Input() dark: boolean = true;

  tag: Tag;
  randomColor: string = '#55b5db'; // default

  private getTagSub: Subscription = new Subscription();

  constructor(
    private wpService: WpService,
    // private colorService: ColorService,
    // private themeService: ThemeService
  ) { }

  ngOnInit() {
    if (this.id) {
      this.getTagSub = this.wpService.getTag(this.id).subscribe((tag: Tag) => {
        if (tag) {
          this.tag = tag;
        }
        this.getTagSub.unsubscribe();
      });

      // this.themeService.bwTheme.subscribe((bw: boolean) => {
      //   if (bw) {
      //     this.randomColor = (this.dark ? 'silver' : '#14141e');
      //   } else {
      //     this.randomColor = this.colorService.generateHslaColors(100, (this.dark ? 80 : 25))[0];
      //   }
      // });
      
    }
  }

  ngOnDestroy(): void {
    this.getTagSub.unsubscribe();
  }

}
