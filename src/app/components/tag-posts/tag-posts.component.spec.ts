import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagPostsComponent } from './tag-posts.component';

describe('TagPostsComponent', () => {
  let component: TagPostsComponent;
  let fixture: ComponentFixture<TagPostsComponent>;

  beforeEach(async(() => {
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
