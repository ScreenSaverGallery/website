import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SsgIconComponent } from './ssg-icon.component';

describe('SsgIconComponent', () => {
  let component: SsgIconComponent;
  let fixture: ComponentFixture<SsgIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [SsgIconComponent]
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
