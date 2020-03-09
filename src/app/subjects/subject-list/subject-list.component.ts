import { Component, OnInit, OnDestroy } from '@angular/core';
import { faPlus, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import { Subscription } from 'rxjs';

import { SubjectService } from '../services/subject.service';
import { Subject } from 'src/app/common/models/Subject';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.scss'],
})
export class SubjectListComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  public subjects: Array<string>;
  public plusIcon: IconDefinition = faPlus;

  constructor(
    private subjectService: SubjectService,
  ) { }

  public ngOnInit(): void {
    this.subscription = this.subjectService.fetchSubjectServer()
      .subscribe((data) => {
        this.subjects = data.map((subject: Subject) => subject.name);
      });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
