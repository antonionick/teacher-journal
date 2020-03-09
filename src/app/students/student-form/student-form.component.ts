import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, of, Subscription } from 'rxjs';

import { IFormConfig } from '../../common/models/Form/Form-config';
import { Student } from '../../common/models/Student';
import { StudentService } from '../services/student.service';
import { FormComponent } from '../../shared/components/index';
import { ConfirmSaveService } from '../../common/services/index';
import { IConfirmSave } from '../../common/models/Confirm-save';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
  providers: [ConfirmSaveService],
})
export class StudentFormComponent implements OnInit {
  private isAdding: boolean = false;

  @ViewChild(FormComponent)
  public formComponent: FormComponent;
  public config: IFormConfig;

  constructor(
    private router: Router,
    private studentService: StudentService,
    private confirmSave: ConfirmSaveService<Student>,
  ) { }

  private getStudent(form: FormGroup): Student {
    return { id: null, ...form.value };
  }

  public ngOnInit(): void {
    this.config = this.studentService.getFormConfig();
  }

  public onSubmit(form: FormGroup): void {
    if (this.isAdding) {
      return;
    }

    this.isAdding = true;
    const student: Student = this.getStudent(form);

    const subscription: Subscription = this.studentService
      .addStudentServer(student).subscribe(() => {
        this.router.navigate(['students']);
        subscription.unsubscribe();
      });
  }

  public showSaveQuestion(): Observable<boolean> {
    if (this.isAdding) {
      return of(true);
    }

    const { form, buttonConfig: { disable } } = this.formComponent;
    const student: Student = this.getStudent(form);
    const config: IConfirmSave<Student> = {
      disable,
      message: 'Do you want to save information?',
      checkEmpty: (data: Student) => this.studentService.checkEmpty(data),
      addToServer: (data: Student) => this.studentService.addStudentServer(data),
      addToStorage: (data: Student) => this.studentService.addStorageStudent(data),
      removeFromStorage: () => this.studentService.clearFormData(),
    };

    return this.confirmSave.confirmNavigation(student, config);
  }
}