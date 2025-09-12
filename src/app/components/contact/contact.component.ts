import { Component, inject } from '@angular/core';
import { SocialMedium } from 'src/app/models/social-medium';
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

  followUs: SocialMedium[] = [
    // {name: 'signal', shortcut: 'signal', urlBase: 'https://signal.group/#CjQKIHzeKjxDhPsOkmyVBuDyY4UfRo5aboltmuM6_DvKTmquEhD75Gre_8iJg4UB7zW6AhMY'},
    {name: 'mastodon', shortcut: 'mastodon', urlBase: 'https://tldr.nettime.org/@screensavergallery'},
    {name: 'telegram', shortcut: 'tlgrm', urlBase: 'https://t.me/screensavergallery'},
    // {name: 'discord', shortcut: 'dc', urlBase: 'https://discord.gg/QJtRUYptRR'},
    {name: 'rss', shortcut: 'rss', urlBase: 'https://sleep.screensaver.gallery/feed/'},
    // {name: 'X', shortcut: 'x', urlBase: 'https://twitter.com/ScreenSaverG'},
    {name: 'instagram', shortcut: 'i', urlBase: 'https://www.instagram.com/screensavergallery/'},
    {name: 'facebook', shortcut: 'fb', urlBase: 'https://www.facebook.com/ScreenSaverGallery'},
    {name: 'github', shortcut: 'git', urlBase: 'https://github.com/ScreenSaverGallery'}
  ];

}
