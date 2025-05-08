import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MaterialModule } from './modules/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// ngx-wp-api
import { NgxWpApiModule } from '@tomaszatoo/ngx-wp-api';
// environments
import { environment } from 'src/environments/environment.production';

import { TruncatePipe } from './pipes/truncate.pipe';
import { AppRoutingModule } from './modules/routing/app-routing.module';
import { AppComponent } from './app.component';
import { PostComponent } from './components/post/post.component';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PostsComponent } from './components/posts/posts.component';
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
import { DemetazoaPipe } from './pipes/demetazoa.pipe';
import { SsgIconComponent } from './components/ssg-icon/ssg-icon.component';
import { StarsComponent } from './components/stars/stars.component';
import { SocialComponent } from './components/social/social.component';
import { SearchComponent } from './components/search/search.component';
import { InfoSliderComponent } from './components/info-slider/info-slider.component';
import { ButtonComponent } from './components/button/button.component';
import { StatsComponent } from './components/stats/stats.component';
import { LoadingComponent } from './components/loading/loading.component';
import { InfoSliderHorizontalComponent } from './components/info-slider-horizontal/info-slider-horizontal.component';
import { FeedComponent } from './components/feed/feed.component';

@NgModule({
  declarations: [
    AppComponent,
    PostComponent,
    HomeComponent,
    NotFoundComponent,
    PostsComponent,
    TagComponent,
    MenuComponent,
    SafeHtmlPipe,
    TruncatePipe,
    MediaComponent,
    TagPostsComponent,
    LoadMoreComponent,
    AuthorComponent,
    AuthorPostsComponent,
    CategoryPostsComponent,
    DemetazoaPipe,
    SsgIconComponent,
    StarsComponent,
    SocialComponent,
    SearchComponent,
    InfoSliderComponent,
    ButtonComponent,
    StatsComponent,
    LoadingComponent,
    InfoSliderHorizontalComponent,
    FeedComponent
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    NgxWpApiModule.forRoot({
      wpRootUrl: environment.wpRootUrl
    })
  ], 
  providers: [provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule { }
