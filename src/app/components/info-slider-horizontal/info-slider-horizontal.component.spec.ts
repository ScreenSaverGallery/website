import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoSliderHorizontalComponent } from './info-slider-horizontal.component';

describe('InfoSliderHorizontalComponent', () => {
  let component: InfoSliderHorizontalComponent;
  let fixture: ComponentFixture<InfoSliderHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoSliderHorizontalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoSliderHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
