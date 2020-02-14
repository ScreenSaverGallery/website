import { Component, OnInit, ElementRef } from '@angular/core';
// services
import { ThemeService } from './services/theme/theme.service';
// local storage
import { LocalStorageService } from 'local-storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title: string = 'Screensaver';
  bwTheme: boolean = false;

  constructor(
    private themeService: ThemeService,
    private localStorage: LocalStorageService,
    private appElm: ElementRef
  ){}

  ngOnInit(): void {
    this.themeService.bwTheme.subscribe((bw: boolean) => {
      this.bwTheme = bw;
    });

    const isSsgBw: string =  this.localStorage.getItem('ssgIsBw');
    if (isSsgBw !== null) { // item was previously saved
      // saved theme
      const isBw = (isSsgBw === 'true' ? true : false); // <= must be converted to boolean (storage store strings)
      this.themeService.setBwTo(Boolean(isBw));
    }
    
  }

  menuAction(open: boolean): void {
    // console.log('menu is open?', open);
    if (open) {
      this.appElm.nativeElement.classList.add('active-menu');
    } else {
      this.appElm.nativeElement.classList.remove('active-menu');
    }
  }

  log(key: any, value: any): void {
    console.log(key, value);
  }
}
