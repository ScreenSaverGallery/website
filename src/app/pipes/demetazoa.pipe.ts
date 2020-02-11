import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'demetazoa'
})
export class DemetazoaPipe implements PipeTransform {

  transform(value: string): string {
    // console.log('demetazoa value', value);
    const host: any = window.location.hostname;
    const replaceHost: string = (host === 'localhost' ? '<a href="http://localhost:4200' : '<a href="https://screensaver.gallery');
    const linkPattern: RegExp = /(\<a[^\>]*>)(.*?)(\<\/a\>)/g;
    let result = value.replace(/(\<a\ href\=\"https\:\/\/screensaver\.metazoa\.org)|(\<a\ href\=\"http\:\/\/screensaver\.metazoa\.org)/g, replaceHost);
    result = result.replace(linkPattern, '$1<span class="link-content">$2</span>$3'); // wprap lins with link-container

    return result;
  }

}
