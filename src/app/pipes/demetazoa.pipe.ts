import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'demetazoa'
})
export class DemetazoaPipe implements PipeTransform {

  transform(value: string): string {
    const host: any = window.location.hostname;
    const replace: string = (host === 'localhost' ? '<a href="http://localhost:4200' : '<a href="https://screensaver.gallery');
    const result = value.replace(/\<a\ href\=\"https\:\/\/screensaver\.metazoa\.org/g, replace);
    return result;
  }

}
