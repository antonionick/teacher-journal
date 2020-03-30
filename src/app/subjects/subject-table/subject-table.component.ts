import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Subscription, throwError } from 'rxjs';
import { takeUntil, mergeMap, switchMap, tap } from 'rxjs/operators';

import { BaseComponent } from 'src/app/components/base/base.component';
import { ITableConfig, ICell, IChangeField } from 'src/app/common/models/table';
import { Subject } from '../../common/models/subject';

import {
  SubjectService,
  SubjectTableService,
  SubjectTableConfigService,
  SubjectTableBodyService,
  SubjectTableHeaderService,
  TableConfigHistoryService,
} from '../services';
import { ButtonConfig } from 'src/app/common/models/button/button-config';

@Component({
  selector: 'app-subject-table',
  templateUrl: './subject-table.component.html',
  styleUrls: ['./subject-table.component.scss'],
  providers: [
    SubjectTableService,
    SubjectTableConfigService,
    SubjectTableHeaderService,
    SubjectTableBodyService,
    TableConfigHistoryService,
  ],
})
export class SubjectTableComponent extends BaseComponent implements OnInit {
  public subject: Subject;
  public config: ITableConfig<ICell<string>>;
  public teacherControl: FormControl;
  public saveButtonConfig: ButtonConfig;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tableService: SubjectTableService,
    private subjectService: SubjectService,
  ) {
    super();
  }

  private setSubject(subject: Subject): void {
    this.subject = subject;
    this.teacherControl.setValue(subject.teacher);
  }

  public ngOnInit(): void {
    this.subject = new Subject();
    this.teacherControl = new FormControl('');
    this.saveButtonConfig = new ButtonConfig();
    this.config = null;

    this.route.paramMap
      .pipe(
        switchMap((params: ParamMap) => {
          const name: string = params.get('subject');
          return this.tableService.fetchSubject(name);
        }),
        switchMap((subject: Subject) => {
          if (subject === null) {
            return throwError('it subject does not exist');
          }

          this.setSubject(subject);
          return this.tableService.fetchConfigData(subject);
        }),
        takeUntil(this.unsubscribe$),
      )
      .subscribe({
        next: (): void => {
          this.config = this.tableService.createConfig();
        },
        error: (): void => {
          this.router.navigate(['subjects']);
        },
      });
  }

  public onUpdateHeaders(): void {
    this.config = this.tableService.updateConfig();
  }

  public onSave(): void {
    if (!this.subject) {
      return;
    }

    const { value } = this.teacherControl;
    this.subject.teacher = value;
    this.saveButtonConfig.disable = true;

    const subscription: Subscription = this.tableService
      .saveChanges(this.subject.id)
      .pipe(
        mergeMap(() => {
          return this.tableService.fetchSubjectMarks(this.subject.id);
        }),
        tap((marks = []) => this.tableService.subjectMarks = marks),
      )
      .subscribe({
        next: () => {
          this.saveButtonConfig.disable = false;
          this.config = this.tableService.createConfig();
          subscription.unsubscribe();
        },
        error: () => {
          console.error('bad internet connection!');
        },
      });

    const subscriptionSaveSubject: Subscription = this.subjectService
      .updateSubject(this.subject)
      .subscribe(() => subscriptionSaveSubject.unsubscribe());
  }

  public onAddDateHeader(): void {
    this.config = this.tableService.addHeader();
  }

  public onDeleteDateHeader(event: MouseEvent): void {
    const classList: DOMTokenList = (event.target as HTMLInputElement).classList;

    if (
      !(classList.contains('table__item_input-date-picker') && (event.ctrlKey || event.metaKey))
    ) {
      return;
    }

    this.config = this.tableService.deleteHeader(event.target as HTMLInputElement);
  }

  public onChangeMark(change: IChangeField<number>): void {
    this.config = this.tableService.updateMark(change);
  }
}
