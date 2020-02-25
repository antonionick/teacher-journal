import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TableComponent } from './components/table/table.component';
import { ButtonComponent } from './components/button/button.component';
import { FormComponent } from './components/form/form.component';

@NgModule({
  declarations: [TableComponent, ButtonComponent, FormComponent],
  imports: [CommonModule, MatTableModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormsModule, ReactiveFormsModule],
  exports: [
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    TableComponent,
    ButtonComponent,
    FormComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SharedModule {}
