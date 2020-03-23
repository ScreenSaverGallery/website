import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSliderComponent } from './info-slider.component';

describe('InfoSliderComponent', () => {
  let component: InfoSliderComponent;
  let fixture: ComponentFixture<InfoSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoSliderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
