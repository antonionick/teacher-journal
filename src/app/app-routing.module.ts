import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubjectPageComponent } from './components/subjects/subject-page/subject-page.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/students', pathMatch: 'full' },
  { path: 'subjects', component: SubjectPageComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  static components = [SubjectPageComponent, PageNotFoundComponent];
}
