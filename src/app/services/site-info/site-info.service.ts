import { Injectable } from '@angular/core';
// services
import { WpService } from '../wp/wp.service';
// rxjs
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SiteInfoService {

  siteInfo: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    private wpServices: WpService
  ) {
    this.getSiteInfo();
  }

  private getSiteInfo(): void {
    const getSiteInfoSub: Subscription = this.wpServices.getSiteInfo().subscribe((res: any) => {
      if (res) {
        this.siteInfo.next(res);
      }
      // unsubscribe
      getSiteInfoSub.unsubscribe();
    });
  }
}
