import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './views/home-page/home-page.component';
import { LexiconPageComponent } from './views/lexicon-page/lexicon-page.component';
import { LoginPageComponent } from './views/login-page/login-page.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { ProfilePageComponent } from './views/profile-page/profile-page.component';
import { SearchPageComponent } from './views/search-page/search-page.component';

const routes: Routes = [
  {path: '', redirectTo: 'LexO-angular/home', pathMatch: 'full'},
  {path: 'LexO-angular/home', component: HomePageComponent},
  {path: 'LexO-angular/login', component: LoginPageComponent},
  {path: 'LexO-angular/lexicon', component: LexiconPageComponent},
  {path: 'LexO-angular/user', component: ProfilePageComponent},
  {path: 'LexO-angular/search', component: SearchPageComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
