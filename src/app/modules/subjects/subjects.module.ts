import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SubjectListComponent } from './components/subject-list/subject-list.component';
import { SubjectAddComponent } from './components/subject-add/subject-add.component';
import { SubjectComponent } from './components/subject/subject.component';

@NgModule({
  declarations: [SubjectListComponent, SubjectAddComponent, SubjectComponent],
  imports: [CommonModule]
})
export class SubjectsModule {}
