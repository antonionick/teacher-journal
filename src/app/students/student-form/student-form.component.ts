import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { IFormConfig } from '../../common/models/Form/Form-config';
import { Student } from '../../common/models/Student';
import { StudentService } from '../services/student.service';
import { FormComponent } from '../../shared/components/index';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
})
export class StudentFormComponent implements OnInit {
  private isAdding: boolean = false;

  @ViewChild(FormComponent)
  public formComponent: FormComponent;
  public config: IFormConfig;

  constructor(private router: Router, private studentService: StudentService) { }

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

    return this.studentService.confirmNavigation(student, disable).pipe(
      map((data: boolean) => {
        return data;
      }),
    );
  }
}
