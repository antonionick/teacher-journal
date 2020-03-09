import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SubjectsRoutingModule } from './subjects-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SubjectListComponent } from './subject-list/subject-list.component';
import { SubjectService } from './services/subject.service';

@NgModule({
  declarations: [SubjectsRoutingModule.components, SubjectListComponent],
  imports: [CommonModule, SharedModule, SubjectsRoutingModule, FontAwesomeModule],
  providers: [SubjectService],
})
export class SubjectsModule { }
