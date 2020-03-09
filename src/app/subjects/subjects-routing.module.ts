import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SubjectPageComponent, SubjectListComponent } from './index';

const routes: Routes = [
  {
    path: 'subjects',
    component: SubjectPageComponent,
    children: [
      { path: '', component: SubjectListComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubjectsRoutingModule {
  public static components = [SubjectPageComponent];
}
