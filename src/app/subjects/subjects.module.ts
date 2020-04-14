import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SubjectsRoutingModule } from './subjects-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SubjectService } from './services';

@NgModule({
  declarations: [SubjectsRoutingModule.components],
  imports: [CommonModule, SharedModule, SubjectsRoutingModule, FontAwesomeModule],
  providers: [SubjectService],
})
export class SubjectsModule { }
