import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { TableComponent, ButtonComponent, FormComponent } from './components';
import { EditMarkDirective } from 'src/app/common/directives/edit-mark.directive';

const publicComponents = [TableComponent, ButtonComponent, FormComponent, EditMarkDirective];
const publicModules = [
  MatTableModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatSortModule,
  MatDatepickerModule,
  MatNativeDateModule,
  ReactiveFormsModule,
  FormsModule,
];

@NgModule({
  declarations: [publicComponents],
  imports: [CommonModule, publicModules],
  exports: [publicModules, publicComponents],
})
export class SharedModule { }
