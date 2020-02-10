import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostComponent } from './components/post/post.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PostsComponent } from './components/posts/posts.component';
import { MainComponent } from './components/main/main.component';
import { TagComponent } from './components/tag/tag.component';
import { MenuComponent } from './components/menu/menu.component';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { MediaComponent } from './components/media/media.component';
import { TagPostsComponent } from './components/tag-posts/tag-posts.component';
import { LoadMoreComponent } from './components/load-more/load-more.component';
import { AuthorComponent } from './components/author/author.component';
import { AuthorPostsComponent } from './components/author-posts/author-posts.component';
import { CategoryPostsComponent } from './components/category-posts/category-posts.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    PostComponent,
    HomeComponent,
    NotFoundComponent,
    PostsComponent,
    MainComponent,
    TagComponent,
    MenuComponent,
    SafeHtmlPipe,
    MediaComponent,
    TagPostsComponent,
    LoadMoreComponent,
    AuthorComponent,
    AuthorPostsComponent,
    CategoryPostsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FlexLayoutModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
