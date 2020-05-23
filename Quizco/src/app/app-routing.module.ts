import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CategoriesComponent } from './categories/categories.component';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { SetupGameComponent } from './setup-game/setup-game.component';
import { GameComponent } from './game/game.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'categories',
    component: CategoriesComponent
  },
  {
    path: 'settings',
    component: SettingsComponent
  },
  {
    path: 'setup',
    redirectTo: 'setup/-1',
    pathMatch: 'full'
  },
  {
    path: 'setup/:categoryId',
    component: SetupGameComponent
  },
  {
    path: 'game/:categoryId/:difficulty/:type/:amount',
    component: GameComponent
  },
  {
    path: 'game',
    component: GameComponent
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
