import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { select, Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';

import { BaseComponent } from '../../components';
import { IFormConfig } from '../../common/models/form';
import { Student } from '../../common/models/student';
import { StudentService } from '../services/student.service';
import { FormComponent } from '../../shared/components';
import { confirmNavigation } from '../../common/helpers/confirm-navigation';
import { StudentFormService } from '../services/student-form.service';
import { IConfirmSave } from '../../common/models/utils/confirm-save';
import { AppState, selectDraftStudent } from '../../@ngrx';
import * as StudentsActions from '../../@ngrx/students/students.actions';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
  providers: [StudentFormService],
})
export class StudentFormComponent extends BaseComponent implements OnInit {
  private initialStudent: Student;
  private isAdding: boolean;

  @ViewChild(FormComponent)
  public formComponent: FormComponent;
  public config: IFormConfig;

  constructor(
    private store: Store<AppState>,
    private router: Router,
    private studentService: StudentService,
    private formService: StudentFormService,
  ) {
    super();
    this.isAdding = false;
    this.initialStudent = null;
  }

  public ngOnInit(): void {
    this.store.pipe(
      select(selectDraftStudent),
      takeUntil(this.unsubscribe$),
    ).subscribe({
      next: (student) => {
        if (student == null && this.initialStudent === null) {
          return this.store.dispatch(StudentsActions.getDraftStudentLocalStorage());
        }

        this.initialStudent = student;
      },
    });

    if (this.initialStudent === null) {
      this.initialStudent = new Student();
    }
    this.config = this.formService.getFormConfig(this.initialStudent);
    // set clear function for form
    this.config.buttons[1].onClick = () => {
      this.formComponent.form.reset();
      this.formService.clearFormConfig();
    };
  }

  public onSubmit(form: FormGroup): void {
    if (this.isAdding) {
      return;
    }
    this.isAdding = true;

    const student: Student = this.formService.getStudentByForm(form);
    this.store.dispatch(StudentsActions.addStudentServer({ student }));
    this.store.dispatch(StudentsActions.updateDraftStudentLocalStorage({ draftStudent: null }));
    this.router.navigate(['students']);
  }

  public showSaveQuestion(): Observable<boolean> {
    if (this.isAdding) {
      return of(true);
    }

    const { form, submitButton: { disable } } = this.formComponent;
    const student: Student = this.formService.getStudentByForm(form);
    const config: IConfirmSave<Student> = {
      disable,
      message: 'Do you want to save changes?',
      isChanged: (data: Student) => this.studentService.isChanged(this.initialStudent, data),
      addToServer: (data: Student) => this.store.dispatch(
        StudentsActions.addStudentServer({ student: data }),
      ),
      addToStorage: (data: Student) => this.store.dispatch(
        StudentsActions.updateDraftStudentLocalStorage({ draftStudent: data }),
      ),
      removeFromStorage: () => this.store.dispatch(
        StudentsActions.updateDraftStudentLocalStorage({ draftStudent: null }),
      ),
    };

    return confirmNavigation<Student>(student, config);
  }
}
