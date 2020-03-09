import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StudentFormComponent, StudentComponent, StudentTableComponent } from './index';
import { CanDeactivateGuard } from './can-deactivate.guard';

const routes: Routes = [
  {
    path: 'students',
    component: StudentComponent,
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
  public static components = [StudentFormComponent, StudentComponent, StudentTableComponent];
}
