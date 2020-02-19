import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StudentListComponent } from "./components/student-list/student-list.component";
import { StudentAddComponent } from "./components/student-add/student-add.component";

@NgModule({
  declarations: [StudentListComponent, StudentAddComponent],
  imports: [CommonModule]
})
export class StudentsModule {}
