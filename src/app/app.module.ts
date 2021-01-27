import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TreeModule } from '@circlon/angular-tree-component';


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
import { TextTreeComponent } from './components/lexicon-panel/document-system-tree/text-tree/text-tree.component';
import { TextDetailComponent } from './components/lexicon-panel/text-detail/text-detail.component';
import { EpigraphyDetailComponent } from './components/lexicon-panel/text-detail/epigraphy-detail/epigraphy-detail.component';
import { EditDetailComponent } from './components/lexicon-panel/text-detail/edit-detail/edit-detail.component';

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
    DocumentSystemTreeComponent,
    TextTreeComponent,
    TextDetailComponent,
    EpigraphyDetailComponent,
    EditDetailComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    TreeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
