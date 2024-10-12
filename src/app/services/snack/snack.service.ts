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

  openSnackBar(message: string, action: string): void {
    this._snackBar.open(message, action, {
      verticalPosition: 'top',
      horizontalPosition: 'center',
      duration: this.duration * 1000
    });
  }
}
