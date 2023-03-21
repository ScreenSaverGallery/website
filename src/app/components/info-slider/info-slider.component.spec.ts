import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InfoSliderComponent } from './info-slider.component';

describe('InfoSliderComponent', () => {
  let component: InfoSliderComponent;
  let fixture: ComponentFixture<InfoSliderComponent>;

  beforeEach(waitForAsync(() => {
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
