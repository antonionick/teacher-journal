import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { TableComponent } from './components/table/table.component';
import { ButtonComponent } from './components/button/button.component';

@NgModule({
  declarations: [TableComponent, ButtonComponent],
  imports: [CommonModule, MatTableModule, MatButtonModule],
  exports: [MatTableModule, MatButtonModule, TableComponent, ButtonComponent],
})
export class SharedModule {}
