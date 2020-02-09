import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorPostsComponent } from './author-posts.component';

describe('AuthorPostsComponent', () => {
  let component: AuthorPostsComponent;
  let fixture: ComponentFixture<AuthorPostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthorPostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
