import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { select, Store } from '@ngrx/store';

import { Observable, of } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import * as SubjectActions from '../../@ngrx/subjects/subjects.actions';
import { AppState, selectDraftSubject } from '../../@ngrx';
import { BaseComponent } from '../../components';
import { SubjectFormService, SubjectService } from '../services';
import { FormComponent } from '../../shared/components';
import { IFormConfig } from 'src/app/common/models/form';
import { Subject } from '../../common/models/subject';
import { confirmNavigation } from '../../common/utils/confirm-navigation';
import { IConfirmSave, TNullable } from '../../common/models/utils';
import { Student } from '../../common/models/student';

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.scss'],
  providers: [SubjectFormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubjectFormComponent extends BaseComponent implements OnInit {
  private isSaving: boolean;
  private initialSubject: TNullable<Subject>;

  @ViewChild('form')
  public formComponent: FormComponent;
  public config$: Observable<IFormConfig>;

  constructor(
    private store: Store<AppState>,
    private formService: SubjectFormService,
    private subjectService: SubjectService,
  ) {
    super();
    this.initialSubject = null;
    this.isSaving = false;
  }

  private resetButton(): void {
    this.formComponent.form.reset();
    this.formService.clearFormData();
  }

  private getInitialSubject(): void {
    this.store.pipe(
      select(selectDraftSubject),
      takeUntil(this.unsubscribe$),
    ).subscribe({
      next: (draftSubject) => {
        if (draftSubject === null && this.initialSubject === null) {
          return this.store.dispatch(SubjectActions.getDraftSubjectLocalStorage());
        }

        this.initialSubject = draftSubject;
      },
    });

    if (this.initialSubject === null) {
      this.initialSubject = new Subject();
    }
  }

  private getConfig(): void {
    this.config$ = this.formService.config.pipe(
      tap(() => {
        const currentFormData: Subject = this.formComponent === undefined ?
          this.initialSubject :
          this.formService.getSubjectByForm(this.formComponent.form);

        this.formService.updateFormData(currentFormData);
      }),
      tap((config) => {
        const resetButtonIndex: number = 1;
        config.buttons[resetButtonIndex].onClick = this.resetButton.bind(this);
      }),
    );
  }

  public ngOnInit(): void {
    this.getInitialSubject();
    this.getConfig();
  }

  public onSubmit(form: FormGroup): void {
    if (this.isSaving) {
      return;
    }
    this.isSaving = true;

    const subject: Subject = this.formService.getSubjectByForm(form);
    this.store.dispatch(SubjectActions.addSubject({ subject, move: true }));
  }

  public showSaveQuestion(): Observable<boolean> {
    if (this.isSaving || this.formComponent === undefined) {
      return of(true);
    }

    const { form } = this.formComponent;
    const subject: Subject = this.formService.getSubjectByForm(form);
    const config: IConfirmSave<Subject> = {
      disable: !form.valid,
      message: 'Do you want to save changes?',
      isChanged: (data: Subject) => this.subjectService.isChanged(this.initialSubject, data),
      addToServer: (data: Subject) => this.store.dispatch(
        SubjectActions.addSubject({ subject: data, move: false }),
      ),
      addToStorage: (draftSubject: Subject) => this.store.dispatch(
        SubjectActions.updateDraftSubjectLocalStorage({ draftSubject }),
      ),
    };

    return confirmNavigation<Subject>(subject, config);
  }
}
