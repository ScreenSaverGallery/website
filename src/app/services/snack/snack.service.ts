import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackService {

  duration: number = 5;

  constructor(
    private _snackBar: MatSnackBar
  ) { }

  openSnackBar(message: string, actionLabel: string, duration: number = this.duration): void {
    this._snackBar.open(message, actionLabel, {
      verticalPosition: 'top',
      horizontalPosition: 'center',
      duration: duration * 1000
    });
  }
}
