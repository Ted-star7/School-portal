import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
     [provideCharts(withDefaultRegisterables())],
    provideHttpClient(), 
    provideClientHydration(),
    ...appConfig.providers, provideCharts(withDefaultRegisterables()),
  ],
})
  .catch((err) => console.error(err));
