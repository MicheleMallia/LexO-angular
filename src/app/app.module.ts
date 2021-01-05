import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LexiconViewComponent } from './views/lexicon-view/lexicon-view.component';
import { LoginPageComponent } from './views/login-page/login-page.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { HomePageComponent } from './views/home-page/home-page.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LexiconViewComponent,
    LoginPageComponent,
    PageNotFoundComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
