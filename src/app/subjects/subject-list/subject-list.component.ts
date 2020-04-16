import { Component, OnInit, OnDestroy } from '@angular/core';
import { faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { select, Store } from '@ngrx/store';

import { takeUntil } from 'rxjs/operators';

import * as SubjectsActions from '../../@ngrx/subjects/subjects.actions';
import { ISubjectState } from '../../@ngrx/subjects';
import { AppState } from '../../@ngrx';
import { BaseComponent } from 'src/app/components/base/base.component';
import { Subject } from 'src/app/common/models/subject';
import { TNullable } from '../../common/models/utils';

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

  private isNeedLoad({ loading, loaded, loadedOne, error }: ISubjectState): boolean {
    this.isLoading = false;

    if (loading) {
      this.isLoading = true;
    } else if ((loadedOne || !loaded) && error === null) {
      return true;
    } else if (error) {
      this.error = error;
    }

    return false;
  }

  public ngOnInit(): void {
    this.store.pipe(
      select('subjects'),
      takeUntil(this.unsubscribe$),
    ).subscribe({
      next: (state) => {
        if (!this.isNeedLoad(state)) {
          return this.subjects = state.subjects;
        }

        this.store.dispatch(SubjectsActions.loadSubjects({ loaded: state.subjects }));
      },
    });
  }
}
