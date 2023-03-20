import { Component, OnInit } from '@angular/core';
// services
import { ColorService } from '../../services/color/color.service';

@Component({
  selector: 'ssg-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

  randomColor: string = 'silver';

  constructor(
    private colorService: ColorService
  ) { } 

  ngOnInit() {
    this.randomColor = this.colorService.generateHslaColors(100)[0];
  }

}
