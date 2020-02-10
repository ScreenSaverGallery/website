import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  constructor() { }

  getRandomColor(alpha: number = 1): string {
    return this.randomRgba(alpha);
  }

  generateHslaColor(saturation: number, lightness: number = 80, alpha: number = 1.0, amount: number = 3) {
    let color: string;
    let hue = Math.trunc(Math.random() * 360)
    color = `hsla(${hue},${saturation}%,${lightness}%,${alpha})`;
    // console.log('generateHslaColors', color);
    return color
  }

  private randomRgba(alpha: number = 1): string {
    const o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(alpha) + ')';
  }
}
