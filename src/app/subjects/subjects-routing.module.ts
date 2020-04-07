import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {
  SubjectPageComponent,
  SubjectListComponent,
  SubjectFormComponent,
  SubjectTableComponent,
} from './index';
import { CanDeactivateGuard } from './can-deactivate.guard';

const routes: Routes = [
  {
    path: 'subjects',
    component: SubjectPageComponent,
    children: [
      {
        path: '',
        component: SubjectListComponent,
        pathMatch: 'full',
      },
      {
        path: 'table/:id',
        component: SubjectTableComponent,
        pathMatch: 'full',
      },
      {
        path: 'add',
        component: SubjectFormComponent,
        canDeactivate: [CanDeactivateGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubjectsRoutingModule {
  public static components = [
    SubjectPageComponent,
    SubjectListComponent,
    SubjectFormComponent,
    SubjectTableComponent,
  ];
}
