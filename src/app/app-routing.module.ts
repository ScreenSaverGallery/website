import { NgModule } from '@angular/core';
import { Routes, RouterModule, UrlSegment } from '@angular/router';
// components
import { MainComponent } from './components/main/main.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PostComponent } from './components/post/post.component';
import { PostsComponent } from './components/posts/posts.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: ':name', component: PostComponent },
  { path: 'archive/:name', component: PostsComponent },
  { path: '**', component: NotFoundComponent }
];



@NgModule({
  imports: [ RouterModule.forRoot(
    routes,
    { enableTracing: false } // <-- debugging purposes only
  )],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
