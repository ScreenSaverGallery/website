import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AuthorPostsComponent } from './author-posts.component';

describe('AuthorPostsComponent', () => {
  let component: AuthorPostsComponent;
  let fixture: ComponentFixture<AuthorPostsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [AuthorPostsComponent]
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
