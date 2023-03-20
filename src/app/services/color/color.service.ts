import { Injectable } from '@angular/core';
// rxjs
import { Observable, Subject } from 'rxjs';
// import { clearInterval } from 'timers';

@Injectable({
  providedIn: 'root'
})
export class ColorService {

  private animationIntervals: any[] = [];

  constructor() {}

  getRandomColor(alpha: number = 1): string {
    return this.randomRgba(alpha);
  }

  getRandomRgba(alpha: number = 1): string {
    return this.randomRgba(alpha);
  }

  generateHslaColors(saturation: number, lightness: number = 80, alpha: number = 1.0, amount: number = 1) {
    let colors: string[] = [];
    for (let i = 0; i < amount; i++) {
      let hue = Math.trunc(Math.random() * 360);
      colors.push(`hsla(${hue},${saturation}%,${lightness}%,${alpha})`);
    }
    return colors;
  }

  getHslaColor(hue: number, saturation: number = 100, lightness: number = 80, alpha: number = 1.0): string {
    return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
  }

  animateRandomColor(time: number, ...hsla: number[]): Observable<string> { // interval
    const subject: Subject<string> = new Subject();
    let hue = hsla[0] ? hsla[0] : 0;
    const saturation = hsla[1] ? hsla[1] : 100;
    const lightness = hsla[2] ? hsla[2] : 80;
    const alpha = hsla[3] ? hsla[3] : 1.0;

    const interval = setInterval(() => {
      hue += Math.random() * 3;
      const randomColor = this.getHslaColor(hue, saturation, lightness, alpha);
      subject.next(randomColor);
    }, time);
    this.animationIntervals.push(interval);

    return subject;
  }

  destroyAnimations(): void {
    for (let i = 0; i < this.animationIntervals.length; i++) {
      clearInterval(this.animationIntervals[i]);
    }
  }


  private randomRgba(alpha: number = 1): string {
    const round = Math.round, random = Math.random, s = 255;
    return `rgba(${round(random() * s)}, ${round(random() * s), round(random() * s), random().toFixed(alpha)})`;
  }
}
