import { Component, inject } from '@angular/core';
import { SocialMedium, followUs } from 'src/app/models/social-medium';
// services
import { ColorService } from 'src/app/services/color/color.service';
import { NgStyle } from '@angular/common';
import { SocialComponent } from '../social/social.component';

@Component({
    selector: 'ssg-contact',
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss',
    standalone: true,
    imports: [NgStyle, SocialComponent]
})
export class ContactComponent {

  private colorService = inject(ColorService);
  randomColor: string = this.colorService.generateHslaColors(100)[0];

  followUs: SocialMedium[] = followUs;

}
