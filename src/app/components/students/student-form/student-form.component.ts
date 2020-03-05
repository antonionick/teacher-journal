import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { FormConfig } from '../../../common/models/Form/Form-config';
import { Student } from '../../../common/models/Student';
import { StudentService } from '../services/student.service';
import { FormComponent } from '../../../shared/components/index';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss'],
})
export class StudentFormComponent implements OnInit {
  private _isAdding: boolean = false;

  @ViewChild(FormComponent)
  public formComponent: FormComponent;
  public config: FormConfig;

  constructor(private _router: Router, private _studentService: StudentService) { }

  private _getStudent(form: FormGroup): Student {
    return { id: null, ...form.value };
  }

  public ngOnInit(): void {
    this.config = this._studentService.getConfig();
  }

  public onSubmit(form: FormGroup): void {
    if (this._isAdding) {
      return;
    }

    this._isAdding = true;
    const student: Student = this._getStudent(form);
    this._studentService.addStudent(student).subscribe(() => {
      this._router.navigate(['students']);
    });
  }

  public showSaveQuestion(): Observable<boolean> {
    if (this._isAdding) {
      return of(true);
    }

    const { form, buttonConfig: { disable } } = this.formComponent;
    const student: Student = this._getStudent(form);

    return this._studentService.confirm(student, disable).pipe(
      map((data: boolean) => {
        return data;
      }),
    );
  }
}
