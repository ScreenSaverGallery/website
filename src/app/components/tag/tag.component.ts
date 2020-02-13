import {
  Component,
  OnInit,
  Input
} from '@angular/core';
// services
import { WpService } from '../../services/wp/wp.service';
import { ColorService } from '../../services/color/color.service';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {

  @Input() id: number;
  @Input() dark: boolean = true;

  tag: any;
  randomColor: string = '#55b5db'; // default

  constructor(
    private wpService: WpService,
    private colorService: ColorService
  ) { }

  ngOnInit() {
    if (this.id) {
      this.wpService.getTag(this.id).subscribe((res: any) => {
        // console.log('tag res', res);
        if (res) {
          this.tag = res;
        }
      });
      this.randomColor = this.colorService.generateHslaColor(100, (this.dark ? 80 : 25));
    }
    
  }

}
