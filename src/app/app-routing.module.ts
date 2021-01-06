import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExtensionsPageComponent } from './views/extensions-page/extensions-page.component';
import { HomePageComponent } from './views/home-page/home-page.component';
import { LexiconViewComponent } from './views/lexicon-view/lexicon-view.component';
import { LoginPageComponent } from './views/login-page/login-page.component';
import { PageNotFoundComponent } from './views/page-not-found/page-not-found.component';
import { ProfilePageComponent } from './views/profile-page/profile-page.component';
import { StatisticsPageComponent } from './views/statistics-page/statistics-page.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomePageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'lexicon', component: LexiconViewComponent},
  {path: 'statistics', component: StatisticsPageComponent},
  {path: 'extensions', component: ExtensionsPageComponent},
  {path: 'user', component: ProfilePageComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
