import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  /*
  loadChildren old syntax - load module only when path is active, we provide 'path#name' of that module
  { path: 'recipes', loadChildren: './recipes/recipes.module#RecipesModule' }
  loadChildren new syntaxt - using a promise:
  */
  { path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(
    module => module.RecipesModule // RecipesModule must not be duplicated in app.module!
  )}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
