import { Injectable } from '@angular/core';
// rxjs
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private _opened: boolean = false;
  opened: BehaviorSubject<boolean> = new BehaviorSubject(this._opened);

  toggle: Subject<any> = new Subject();

  constructor() { }

  open(): void {
    this._opened = true;
    this.emitOpened();
  }

  close(): void {
    this._opened = false;
    this.emitOpened();
  }

  // toggle(): void {
  //   this._opened = !this._opened;
  //   this.emitOpened();
  // }

  private emitOpened(): void {
    this.opened.next(this._opened);
  }
}
