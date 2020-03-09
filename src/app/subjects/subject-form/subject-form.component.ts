import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription, Observable, of } from 'rxjs';

import { SubjectFormService } from '../services/subject-form.service';
import { FormComponent } from '../../shared/components/index';
import { IFormConfig } from 'src/app/common/models/Form';
import { Subject } from '../../common/models/Subject';
import { SubjectService } from '../services/subject.service';
import { ConfirmSaveService } from '../../common/services/index';
import { IConfirmSave } from '../../common/models/Confirm-save';

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.scss'],
  providers: [SubjectFormService, ConfirmSaveService],
})
export class SubjectFormComponent implements OnInit {
  private isSaving: boolean;
  @ViewChild('form')
  public form: FormComponent;
  public config: IFormConfig;

  constructor(
    private formService: SubjectFormService,
    private subjectService: SubjectService,
    private confirmSave: ConfirmSaveService<Subject>,
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
    const subject: Subject = this.formService.getSubjectOfForm(form);
    const config: IConfirmSave<Subject> = {
      disable: !form.valid,
      message: 'Do you want to save information?',
      checkEmpty: (data: Subject) => this.subjectService.checkEmptySubject(data),
      addToServer: (data: Subject) => this.subjectService.addSubjectServer(data),
      addToStorage: (data: Subject) => this.subjectService.addSubjectStorage(data),
      removeFromStorage: () => this.subjectService.removeSubjectStorage(),
    };

    return this.confirmSave.confirmNavigation(subject, config);
  }
}