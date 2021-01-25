import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonModule } from "@angular/material/button";


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LexiconPageComponent } from './views/lexicon-page/lexicon-page.component';
import { LoginPageComponent } from './views/login-page/login-page.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { HomePageComponent } from './views/home-page/home-page.component';
import { ProfilePageComponent } from './views/profile-page/profile-page.component';
import { LexiconPanelComponent } from './components/lexicon-panel/lexicon-panel.component';
import { MetadataPanelComponent } from './components/metadata-panel/metadata-panel.component';
import { ReferencePanelComponent } from './components/reference-panel/reference-panel.component';
import { SearchPageComponent } from './views/search-page/search-page.component';
import { DataSearchFormComponent } from './components/data-search-form/data-search-form.component';
import { BibliographySearchFormComponent } from './components/bibliography-search-form/bibliography-search-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DocumentSystemTreeComponent } from './components/lexicon-panel/document-system-tree/document-system-tree.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LexiconPageComponent,
    LoginPageComponent,
    PageNotFoundComponent,
    HomePageComponent,
    ProfilePageComponent,
    LexiconPanelComponent,
    MetadataPanelComponent,
    ReferencePanelComponent,
    SearchPageComponent,
    DataSearchFormComponent,
    BibliographySearchFormComponent,
    DocumentSystemTreeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatIconModule,
    MatButtonModule,
    MatTreeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
