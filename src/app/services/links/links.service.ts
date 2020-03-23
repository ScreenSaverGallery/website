import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LinksService {

  downloadLink: string = '/get';
  homeLink: string = '/';

  constructor() { }
}
