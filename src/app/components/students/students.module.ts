import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { StudentsRoutingModule } from './students-routing.module';
import { StudentService } from './services/student.service';
import { StudentFormService } from './services/student-form.service';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [StudentsRoutingModule.components],
  imports: [CommonModule, SharedModule, FontAwesomeModule, StudentsRoutingModule],
  providers: [StudentService, StudentFormService],
})
export class StudentsModule { }
