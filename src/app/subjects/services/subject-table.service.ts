import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ITableConfig, ICell } from '../../common/models/Table';
import { SubjectTableConfigService } from './subject-table-config.service';
import { SubjectService } from './subject.service';
import { StudentService } from 'src/app/students/services/student.service';
import { Subject } from '../../common/models/Subject';
import { Student } from 'src/app/common/models/Student';

@Injectable()
export class SubjectTableService {
  public config: ITableConfig<ICell<string>>;

  constructor(
    private configService: SubjectTableConfigService,
    private studentService: StudentService,
    private subjectService: SubjectService,
  ) { }

  public getFullConfig(): ITableConfig<ICell<string>> {
    return this.configService.createConfig();
  }

  public updateConfig(): ITableConfig<ICell<string>> {
    return this.configService.updateConfig();
  }

  public fetchSubject(name: string): Observable<Subject> {
    return this.subjectService.fetchSubjectServer().pipe(
      map((subjects: Array<Subject>) => {
        for (let i: number = 0; i < subjects.length; i++) {
          if (subjects[i].name === name) {
            return subjects[i];
          }
        }

        return null;
      }),
    );
  }

  public fetchSubjectStudents(studentsID: Array<number>): Observable<Array<Student>> {
    return this.studentService.fetchStudentsServer().pipe(
      map((students: Array<Student>) => {
        const ids: { [key: string]: boolean } = {};
        studentsID.forEach((id: number) => {
          ids[id] = true;
        });

        return students.filter((student: Student) => {
          return ids[student.id];
        });
      }),
    );
  }
}
