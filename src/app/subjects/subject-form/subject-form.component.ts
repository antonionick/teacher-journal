import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription, Observable, of } from 'rxjs';

import { SubjectFormService } from '../services/subject-form.service';
import { FormComponent } from '../../shared/components/index';
import { IFormConfig } from 'src/app/common/models/Form';
import { Subject } from '../../common/models/Subject';
import { SubjectService } from '../services/subject.service';

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.scss'],
  providers: [SubjectFormService],
})
export class SubjectFormComponent implements OnInit {
  private isSaving: boolean;
  @ViewChild('form')
  public form: FormComponent;
  public config: IFormConfig;

  constructor(
    private formService: SubjectFormService,
    private subjectService: SubjectService,
    private router: Router,
  ) {
    this.isSaving = false;
  }

  public ngOnInit(): void {
    this.config = this.formService.config;
  }

  public onSubmit(data: FormGroup): void {
    this.isSaving = true;

    const subject: Subject = this.formService.getSubjectOfForm(data);
    const subscription: Subscription = this.subjectService.addSubjectServer(subject)
      .subscribe(() => {
        this.router.navigate(['subjects']);
        subscription.unsubscribe();
      });
  }

  public showSaveQuestion(): Observable<boolean> {
    if (this.isSaving) {
      return of(true);
    }

    const { form } = this.form;
    return this.formService.confirmNavigation(form, !form.valid);
  }
}
