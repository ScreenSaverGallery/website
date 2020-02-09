import {
  Component,
  OnInit,
  Input
} from '@angular/core';
// services
import { WpService } from '../../services/wp/wp.service';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {

  @Input() id: number;

  tag: any;

  constructor(
    private wpService: WpService
  ) { }

  ngOnInit() {
    if (this.id) {
      this.wpService.getTag(this.id).subscribe((res: any) => {
        // console.log('tag res', res);
        if (res.status === 200) {
          this.tag = res.body;
        }
      });
    }
    
  }

}
