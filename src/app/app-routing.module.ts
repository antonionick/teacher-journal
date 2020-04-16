import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent, BreadcrumbsComponent } from './components';

const routes: Routes = [
  { path: '', redirectTo: '/students', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  public static components = [PageNotFoundComponent, BreadcrumbsComponent];
}
