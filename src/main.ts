
import { enableProdMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { environment } from './environments/environment.production';
import { provideHttpClient } from '@angular/common/http';
import { provideNgxWpApi } from '@tomaszatoo/ngx-wp-api';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
      provideRouter(routes),

      // importProvidersFrom(BrowserModule, FormsModule, ReactiveFormsModule),
      provideHttpClient(/* withInterceptorsFromDi() */),
      provideNgxWpApi({
        wpRootUrl: environment.wpRootUrl
      })
    ]
})
  .catch(err => console.error(err));
