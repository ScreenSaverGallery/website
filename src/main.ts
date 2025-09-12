
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

import { environment } from './environments/environment.production';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideNgxWpApi } from '@tomaszatoo/ngx-wp-api';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxWpApiModule } from '@tomaszatoo/ngx-wp-api';
import { environment as environment_1 } from 'src/environments/environment.production';
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
      }),
      provideAnimations()
    ]
})
  .catch(err => console.error(err));
