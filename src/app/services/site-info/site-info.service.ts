import { Injectable } from '@angular/core';
// services
import { WpService } from '../wp/wp.service';
// rxjs
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SiteInfoService {

  siteInfo: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    private wpServices: WpService
  ) { }

  getSiteInfo(): void {
    this.wpServices.getSiteInfo().subscribe((res: any) => {
      if (res && res.status === 200) {
        this.siteInfo.next(res.body);
      }
    });
  }
}
