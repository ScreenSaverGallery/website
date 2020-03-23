import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ssg-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchCtrl: FormControl = new FormControl();
  results: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
