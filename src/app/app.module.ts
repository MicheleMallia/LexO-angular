import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LexiconViewComponent } from './views/lexicon-view/lexicon-view.component';
import { LoginPageComponent } from './views/login-page/login-page.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { HomePageComponent } from './views/home-page/home-page.component';
import { ProfilePageComponent } from './views/profile-page/profile-page.component';
import { StatisticsPageComponent } from './views/statistics-page/statistics-page.component';
import { ExtensionsPageComponent } from './views/extensions-page/extensions-page.component';
import { LexiconPanelComponent } from './components/lexicon-panel/lexicon-panel.component';
import { MetadataPanelComponent } from './components/metadata-panel/metadata-panel.component';
import { ReferencePanelComponent } from './components/reference-panel/reference-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LexiconViewComponent,
    LoginPageComponent,
    PageNotFoundComponent,
    HomePageComponent,
    ProfilePageComponent,
    StatisticsPageComponent,
    ExtensionsPageComponent,
    LexiconPanelComponent,
    MetadataPanelComponent,
    ReferencePanelComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
