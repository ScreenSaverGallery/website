import { Routes } from '@angular/router';
// components
import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { PostComponent } from './components/post/post.component';
import { CategoryPostsComponent } from './components/category-posts/category-posts.component';
import { TagPostsComponent } from './components/tag-posts/tag-posts.component';
import { AuthorPostsComponent } from './components/author-posts/author-posts.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { SponsorComponent } from './components/sponsor/sponsor.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'sponsor', component: SponsorComponent },
  /* { path: 'thanks', component: DonateComponent }, */
  // { path: 'feed', component: FeedComponent }, // <-- not works as xml result :/
  { path: ':name', component: PostComponent },
  { path: 'archive/:name', component: CategoryPostsComponent },
  { path: 'archive/:name/:subarchive', component: CategoryPostsComponent },
  { path: 'tag/:name', component: TagPostsComponent },
  { path: 'author/:name', component: AuthorPostsComponent },
  
  { path: 'error/404', component: NotFoundComponent }, // for handy purpose
  { path: '**', component: NotFoundComponent }
];