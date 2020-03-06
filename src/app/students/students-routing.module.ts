import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudentFormComponent, StudentPageComponent, StudentTableComponent } from './';
import { CanDeactivateGuard } from './can-deactivate.guard';

const routes: Routes = [
  {
    path: 'students',
    component: StudentPageComponent,
    children: [
      {
        path: '',
        component: StudentTableComponent,
        pathMatch: 'full',
      },
      {
        path: 'add',
        component: StudentFormComponent,
        canDeactivate: [CanDeactivateGuard],
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentsRoutingModule {
  static components = [StudentFormComponent, StudentPageComponent, StudentTableComponent];
}
