import { Component, inject, OnInit, OnDestroy } from '@angular/core';
// router
import { ActivatedRoute, ParamMap } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// components
import { SponsorComponent } from '../sponsor/sponsor.component';
// services
import { ColorService } from 'src/app/services/color/color.service';
// rxjs
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'ssg-donate',
  standalone: true,
  imports: [
    SponsorComponent
  ],
  templateUrl: './donate.component.html',
  styleUrl: './donate.component.scss'
})
export class DonateComponent implements OnInit, OnDestroy {

  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private color = inject(ColorService);
  release!: string;
  assets!: any[];
  randomColor: string = 'silver';
  private routeSub: Subscription = new Subscription();

  ngOnInit(): void {
    this.randomColor = this.color.generateHslaColors(100)[0];
    const os = this.route.snapshot.queryParamMap.get('get');
    if (os) {
      // GET LATEST RELEASES FROM GITHUB
      this.getGitHubAssets<any>(os).subscribe({
        next: (value: any) => {
          // console.log('githubassets', value);
          if (value && value.assets.length/* && value.assets[0].browser_download_url*/ ) {
            // this.assets = value.assets.filter((o: any) => !o.name.includes('blockmap')); // blockmap is a product by windows NSIS
            this.assets = this.getOsRelease(os, value.assets);
            // console.log('assets for os', os, this.assets);
            this.release = this.assets[0].browser_download_url;
            /* TODO: AUTOMATIC DOWNLOAD */
            // console.log('DOWNLOAD URL', this.release);
            if (this.assets.length && this.assets.length === 1) {
              setTimeout(() => {
                const asset = this.assets[0];
                // console.log('START DOWNLOAD', asset.name);
                this.downloadURI(asset.browser_download_url, asset.name);
              }, 5000);
            }
          }
        },
        error: (e: unknown) => console.error(e)
      })
    }
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }

  private getOsRelease(os: string, assets: any[]): any {
    const osAssets = {
      macos: ['dmg'],
      linux: ['rpm', 'AppImage', 'deb'],
      windows: ['exe']
    }
    const result = [];
    for (const suffix of osAssets[os]) {
      for (const asset of assets) {
        const re = new RegExp(`${suffix}$`)
        if (re.test(asset.name)) {
          result.push(asset);
        }
      }
    }
    return result;
  }

  private downloadURI(uri: string, name: string): void {
    const link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private getGitHubAssets<T>(os: string): Observable<T> {
    // console.log('GET GITHUBASSETS', os);
    return this.http.get<T>(`https://api.github.com/repos/screensavergallery/liminal-screen/releases/latest`, { headers: new HttpHeaders(
      { 'Accept': 'application/vnd.github.v3+json' }
    )});
  }

}
