import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { select, Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import * as StudentsActions from '../../@ngrx/students/students.actions';
import { AppState, selectDraftStudent } from '../../@ngrx';
import { BaseComponent } from '../../components';
import { IFormConfig } from '../../common/models/form';
import { Student } from '../../common/models/student';
import { StudentService, StudentFormService } from '../services';
import { FormComponent } from '../../shared/components';
import { confirmNavigation } from '../../common/utils/confirm-navigation';
import { IConfirmSave, TNullable } from '../../common/models/utils';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
  providers: [StudentFormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentFormComponent extends BaseComponent implements OnInit {
  private initialStudent: TNullable<Student>;
  private isAdding: TNullable<boolean>;

  @ViewChild(FormComponent)
  public formComponent: FormComponent;
  public config$: Observable<IFormConfig>;

  constructor(
    private store: Store<AppState>,
    private studentService: StudentService,
    private formService: StudentFormService,
  ) {
    super();
    this.isAdding = false;
    this.initialStudent = null;
  }

  private resetButton(): void {
    this.formComponent.form.reset();
    this.formService.clearFormConfig();
  }

  private getInitialStudent(): void {
    this.store.pipe(
      select(selectDraftStudent),
      takeUntil(this.unsubscribe$),
    ).subscribe({
      next: (student) => {
        if (student === null && this.initialStudent === null) {
          return this.store.dispatch(StudentsActions.getDraftStudentLocalStorage());
        }

        this.initialStudent = student;
      },
    });

    if (this.initialStudent === null) {
      this.initialStudent = new Student();
    }
  }

  private getFormConfig(): void {
    this.config$ = this.formService.config.pipe(
      tap(() => {
        const currentFormData: Student = this.formComponent === undefined ?
          this.initialStudent :
          this.formService.getStudentByForm(this.formComponent.form);

        this.formService.updateConfigData(currentFormData);
      }),
      tap((config) => {
        const clearButtonIndex: number = 1;
        config.buttons[clearButtonIndex].onClick = this.resetButton.bind(this);
      }),
      takeUntil(this.unsubscribe$),
    );
  }

  public ngOnInit(): void {
    this.getInitialStudent();
    this.getFormConfig();
  }

  public onSubmit(form: FormGroup): void {
    if (this.isAdding) {
      return;
    }
    this.isAdding = true;

    const student: Student = this.formService.getStudentByForm(form);
    this.store.dispatch(StudentsActions.addStudentServer({ student, move: true }));
  }

  public showSaveQuestion(): Observable<boolean> {
    if (this.isAdding || this.formComponent === undefined) {
      return of(true);
    }

    const { form, submitButton: { disable } } = this.formComponent;
    const student: Student = this.formService.getStudentByForm(form);
    const config: IConfirmSave<Student> = {
      disable,
      message: 'Do you want to save changes?',
      isChanged: (data: Student) => this.studentService.isChanged(this.initialStudent, data),
      addToServer: (data: Student) => this.store.dispatch(
        StudentsActions.addStudentServer({ student: data, move: false }),
      ),
      addToStorage: (data: Student) => this.store.dispatch(
        StudentsActions.updateDraftStudentLocalStorage({ draftStudent: data }),
      ),
    };

    return confirmNavigation<Student>(student, config);
  }
}
