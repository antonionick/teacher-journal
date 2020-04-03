import { Component, OnInit, OnDestroy } from '@angular/core';
import { faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { select, Store } from '@ngrx/store';

import { takeUntil } from 'rxjs/operators';

import { BaseComponent } from 'src/app/components/base/base.component';
import { Subject } from 'src/app/common/models/subject';
import { AppState } from '../../@ngrx';
import * as SubjectsActions from '../../@ngrx/subjects/subjects.actions';
import { ISubjectState } from '../../@ngrx/subjects/subjects.state';
import { TNullable } from '../../common/models/utils/tnullable';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.scss'],
})
export class SubjectListComponent extends BaseComponent implements OnInit, OnDestroy {
  public subjects: Array<Subject>;
  public plusIcon: IconDefinition;
  public error: TNullable<Error | string>;
  public isLoading: boolean;

  constructor(
    private store: Store<AppState>,
  ) {
    super();
    this.plusIcon = faPlus;
    this.error = null;
  }

  private isNeedLoad({ loading, loaded, error }: ISubjectState): boolean {
    this.isLoading = false;

    if (loading) {
      this.isLoading = true;
    } else if (error) {
      this.error = error;
    } else if (!loaded) {
      return true;
    }

    return false;
  }

  public ngOnInit(): void {
    this.store.pipe(
      select('subjects'),
      takeUntil(this.unsubscribe$),
    ).subscribe({
      next: (subjectsState) => {
        if (!this.isNeedLoad(subjectsState)) {
          this.subjects = subjectsState.subjects;
          return;
        }

        this.store.dispatch(SubjectsActions.loadSubjects());
      },
    });
  }
}
