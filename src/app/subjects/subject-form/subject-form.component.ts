import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';

import { SubjectFormService, SubjectService } from '../services';
import { FormComponent } from '../../shared/components';
import { IFormConfig } from 'src/app/common/models/form';
import { Subject } from '../../common/models/subject';
import { confirmNavigation } from '../../common/helpers/confirm-navigation';
import { IConfirmSave } from '../../common/models/utils/confirm-save';

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

    // set clear function for form
    this.config.buttons[1].onClick = () => {
      const { form } = this.form;

      form.reset();
      this.subjectService.removeSubjectStorage();
    };
  }

  public onSubmit(data: FormGroup): void {
    this.isSaving = true;

    const subject: Subject = this.formService.getSubjectOfForm(data);
    subject.name = subject.name.toLowerCase();
    this.subjectService.addSubjectServer(subject)
      .subscribe(() => {
        this.router.navigate(['subjects']);
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
      message: 'Do you want to save changes?',
      isChanged: (data: Subject) => true,
      addToServer: (data: Subject) => this.subjectService.addSubjectServer(data),
      addToStorage: (data: Subject) => this.subjectService.addSubjectStorage(data),
      removeFromStorage: () => this.subjectService.removeSubjectStorage(),
    };

    return confirmNavigation<Subject>(subject, config);
  }
}
