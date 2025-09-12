import { Component } from '@angular/core';
import { SsgIconComponent } from '../ssg-icon/ssg-icon.component';

@Component({
    selector: 'ssg-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    standalone: true,
    imports: [SsgIconComponent]
})
export class LoadingComponent {

}
