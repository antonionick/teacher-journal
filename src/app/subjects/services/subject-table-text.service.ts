import { Injectable } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

import { Observable, of } from 'rxjs';
import { map, mergeMap, startWith, take, tap } from 'rxjs/operators';

import { SubjectTableText, ITranslateSubjectTableText } from '../models';

@Injectable()
export class SubjectTableTextService {
  private readonly textConfig: SubjectTableText;

  public get text(): Observable<SubjectTableText> {
    return this.translate.onLangChange.pipe(
      startWith({ lang: null }),
      mergeMap((event: LangChangeEvent) => (
        event.lang === null ? this.getTextTranslation() : of(this.convertTranslation(event))
      )),
      tap((data: ITranslateSubjectTableText) => this.translateText(data)),
      map(() => (
        { ...this.textConfig }
      )),
    );
  }

  constructor(private translate: TranslateService) {
    this.textConfig = new SubjectTableText();
  }

  private getTextTranslation(): Observable<ITranslateSubjectTableText> {
    return this.translate.get('SUBJECTS.TABLE.TEXT').pipe(
      take(1),
    );
  }

  private convertTranslation(
    { translations }: LangChangeEvent,
  ): Observable<ITranslateSubjectTableText> {
    return translations.SUBJECTS.TABLE.TEXT;
  }

  private translateText(text: ITranslateSubjectTableText): void {
    this.textConfig.addHeader = text['ADD HEADER'];
    this.textConfig.deleteHeader = text['DELETE HEADER'];
    this.textConfig.saveChanges = text['SAVE CHANGES'];
    this.textConfig.teacher = text.TEACHER;
  }
}
