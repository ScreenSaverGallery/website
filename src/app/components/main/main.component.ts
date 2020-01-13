import {
  Component,
  OnInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// rxjs
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  state: Observable<any>;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    // console.log('route', this.route);
    this.state = this.route.paramMap.pipe(map(() =>  window.history.state));
    this.state.subscribe((state: any) => {
      console.log('route state', state);
    })
  }

}
