import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { Subscription } from 'rxjs';
import { takeUntil, mergeMap } from 'rxjs/operators';

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
} from '../services/index';

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
    this.config = null;

    this.route.paramMap
      .pipe(
        mergeMap((params: ParamMap) => {
          const name: string = params.get('subject');
          return this.tableService.fetchSubject(name);
        }),
        mergeMap((subject: Subject) => {
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

  public onUpdateHeaders(event: MatDatepickerInputEvent<Date>): void {
    this.config = this.tableService.updateConfig();
  }

  public onSave(): void {
    if (!this.subject) {
      return;
    }

    this.tableService.saveChanges(this.subject.id);

    const { value } = this.teacherControl;
    this.subject.teacher = value;
    const subscription: Subscription = this.subjectService
      .updateSubject(this.subject)
      .subscribe(() => subscription.unsubscribe());
  }

  public onAddDateHeader(event: Event): void {
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
