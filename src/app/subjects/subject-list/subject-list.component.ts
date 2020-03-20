import { Component, OnInit, OnDestroy } from '@angular/core';
import { faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { map, takeUntil } from 'rxjs/operators';

import { SubjectService } from '../services/subject.service';
import { Subject } from 'src/app/common/models/subject';
import { BaseComponent } from 'src/app/components/base/base.component';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.scss'],
})
export class SubjectListComponent extends BaseComponent implements OnInit, OnDestroy {
  public subjects: Array<string>;
  public plusIcon: IconDefinition = faPlus;

  constructor(private subjectService: SubjectService) {
    super();
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.subjectService
      .fetchSubjectServer()
      .pipe(
        map((data) => data.map((subject: Subject) => subject.name)),
        takeUntil(this.unsubscribe$),
      )
      .subscribe((subjects) => {
        this.subjects = subjects;
      });
  }
}
