import { Injectable } from '@angular/core';
// rxjs
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private _bwTheme: boolean = true;
  bwTheme: BehaviorSubject<boolean> = new BehaviorSubject(this._bwTheme);

  constructor() {}

  toggleBW(): void {
    // console.log('toggleBW');
    this._bwTheme = !this._bwTheme;
    this.bwTheme.next(this._bwTheme);
  }

  setBwTo(value: boolean): void {
    // console.log('setBwTo', value);
    this._bwTheme = value;
    this.bwTheme.next(this._bwTheme);
  }

  isBw(): boolean {
    return this._bwTheme;
  }
}
