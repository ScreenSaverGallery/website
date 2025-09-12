import {
  Component,
  OnInit,
  Output,
  EventEmitter
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
// services
import { WpService } from '../../services/wp/wp.service';
// rxjs
import { Observable, of, Subject } from 'rxjs';
import {map, startWith, catchError, debounceTime, switchMap} from 'rxjs/operators';
import { MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatOption } from '@angular/material/core';
import { AsyncPipe } from '@angular/common';
import { SafeHtmlPipe } from '../../pipes/safe-html.pipe';

interface SearchItem {
  id: number,
  title: string,
  url: string,
  type: string,
  subtype: string
}

@Component({
    selector: 'ssg-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    standalone: true,
    imports: [MatFormField, MatIcon, MatPrefix, MatInput, FormsModule, MatAutocompleteTrigger, ReactiveFormsModule, MatSuffix, MatProgressSpinner, MatAutocomplete, MatOption, AsyncPipe, SafeHtmlPipe]
})
export class SearchComponent implements OnInit {

  searchCtrl: FormControl = new FormControl();
  filteredOptions: Observable<SearchItem[]>;
  searching: boolean = false;

  @Output() optionSelected: EventEmitter<SearchItem> = new EventEmitter(); 

  constructor(
    private wpService: WpService
  ) { }

  ngOnInit(): void {

    this.filteredOptions = this.searchCtrl.valueChanges
    .pipe(
      startWith(''),
      // delay emits
      debounceTime(300),
      switchMap(value => {
        if (value !== '') {
          // lookup from again
          return this.lookup(value);
        } else {
          // if no value is present, return null
          return of(null);
        }
      })
    );
  }

  lookup(value: string): Observable<any> {
    if (typeof value === 'string') {
      this.searching = true;
      return this.wpService.search(value.toLowerCase()).pipe(
        map(result => {
          console.log('wpService.search result', result);
          this.searching = false;
          return result
        }),
        catchError(_ => {
          this.searching = false;
          return of(null);
        })
      );
    } else {
      this.searching = false;
      return of(null);
    }
  }

  displayFn(): string {
    return ''; // return empty string everytime to reset search input
  }

  selected(event: any): void {
    this.optionSelected.emit(event.option.value);
  }

  log(key: any, value: any): void {
    console.log(key, value);
  }

}
