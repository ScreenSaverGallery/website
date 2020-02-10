import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsgIconComponent } from './ssg-icon.component';

describe('SsgIconComponent', () => {
  let component: SsgIconComponent;
  let fixture: ComponentFixture<SsgIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SsgIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsgIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
