import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ITableConfig, ICell, TableHeaderConfig } from '../../common/models/Table';
import { StudentService } from 'src/app/students/services/student.service';
import { Subject } from '../../common/models/Subject';
import { Student } from 'src/app/common/models/Student';
import { Mark } from 'src/app/common/models/Mark';
import { SubjectService } from './subject.service';
import { SubjectTableConfigService } from './subject-table-config.service';

const headerConfig: Array<TableHeaderConfig> = [
  new TableHeaderConfig({
    value: 'name',
  }),
  new TableHeaderConfig({
    value: 'lastName',
    sticky: true,
  }),
  new TableHeaderConfig({
    value: 'average mark',
    sort: true,
    isAscSortStart: false,
  }),
];

const mockStudents: Array<Student> = [
  {
    id: 1,
    name: 'Student1',
    lastName: 'LastName1',
    address: 'It is my address',
    description: 'It is description',
    subjects: [],
  },
  {
    id: 2,
    name: 'dada',
    lastName: 'adadas',
    address: '',
    description: '',
    subjects: [],
  },
];

const mockMarks: Array<Mark> = [
  {
    id: 1,
    studentId: 1,
    subjectId: 1,
    date: 1026000000,
    value: 5,
  },
  {
    id: 2,
    studentId: 1,
    subjectId: 1,
    date: 5432400000,
    value: 6,
  },
  {
    id: 3,
    studentId: 2,
    subjectId: 1,
    date: 5778000000,
    value: 5,
  },
  {
    id: 4,
    studentId: 2,
    subjectId: 1,
    date: 1026000000,
    value: 7,
  },
];

@Injectable()
export class SubjectTableService {
  constructor(
    private configService: SubjectTableConfigService,
    private studentService: StudentService,
    private subjectService: SubjectService,
  ) { }

  public createConfig(): ITableConfig<ICell<string>> {
    return this.configService.createConfig(headerConfig, mockStudents, mockMarks);
  }

  public updateConfig(): ITableConfig<ICell<string>> {
    return this.configService.updateConfig();
  }

  public addHeader(): ITableConfig<ICell<string>> {
    return this.configService.addHeader();
  }

  public deleteHeader(input: HTMLInputElement): ITableConfig<ICell<string>> {
    return this.configService.deleteHeader(input);
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
