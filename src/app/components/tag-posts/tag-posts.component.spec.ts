import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TagPostsComponent } from './tag-posts.component';

describe('TagPostsComponent', () => {
  let component: TagPostsComponent;
  let fixture: ComponentFixture<TagPostsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TagPostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
