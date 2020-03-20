import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';

import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { BaseComponent } from 'src/app/components/base/base.component';
import { ITableConfig, ICell, IChangeField } from 'src/app/common/models/table';
import { Subject } from '../../common/models/subject';

import { SubjectService } from '../services/subject.service';
import { SubjectTableService } from '../services/subject-table.service';
import { SubjectTableConfigService } from '../services/subject-table-config.service';
import { SubjectTableHeaderService } from '../services/subject-table-header.service';
import { SubjectTableBodyService } from '../services/subject-table-body.service';

@Component({
  selector: 'app-subject-table',
  templateUrl: './subject-table.component.html',
  styleUrls: ['./subject-table.component.scss'],
  providers: [
    SubjectTableService,
    SubjectTableConfigService,
    SubjectTableHeaderService,
    SubjectTableBodyService,
  ],
})
export class SubjectTableComponent extends BaseComponent implements OnInit {
  public subject: Subject;
  public config: ITableConfig<ICell<string>>;
  public teacherControl: FormControl;

  constructor(
    private route: ActivatedRoute,
    private tableService: SubjectTableService,
    private subjectService: SubjectService,
  ) {
    super();
  }

  private getSubject(name: string): void {
    this.tableService
      .fetchSubject(name)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (subject: Subject = new Subject()) => {
          this.subject = subject;
          this.teacherControl.setValue(this.subject.teacher);
        },
      });
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.subject = new Subject();
    this.teacherControl = new FormControl('');
    this.config = this.tableService.createConfig();

    this.route.paramMap.pipe(takeUntil(this.unsubscribe$)).subscribe({
      next: (params: ParamMap): void => {
        const subjectName: string = params.get('subject');
        this.getSubject(subjectName);
      },
    });
  }

  public onUpdateHeaders(event: MatDatepickerInputEvent<Date>): void {
    this.config = this.tableService.updateConfig();
  }

  public onSaveTeacher(): void {
    if (!this.subject) {
      return;
    }

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
