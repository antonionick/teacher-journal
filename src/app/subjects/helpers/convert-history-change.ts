import { TableConfigHistory } from '../../common/models/table/table-config-history';
import { Mark, MarkHistory, IMarksByDate } from '../../common/models/mark';
import { IDataChanges } from '../../common/models/useful/data-changes';
import { TNullable } from 'src/app/common/models/useful/tnullable';

enum Actions {
  update,
  create,
  delete,
}

let subjectId: number;
let created: Array<Mark> = [];
let updated: Array<Mark> = [];
let deleted: Array<Mark> = [];

function getMark(
  { source }: TableConfigHistory,
  { studentId }: MarkHistory,
  marks: IMarksByDate,
): TNullable<Mark> {
  return marks[source] ? marks[source][studentId] || null : null;
}

function deleteMarksByDate(date: number, marks: IMarksByDate): void {
  if (!marks[date]) {
    return;
  }

  Object.values(marks[date]).forEach((item) => {
    deleted.push(item);
  });
}

function createMark({ current }: TableConfigHistory, { studentId, value }: MarkHistory): Mark {
  return new Mark({
    studentId,
    subjectId,
    value,
    date: current,
  });
}

function updateMark(
  { source, current }: TableConfigHistory,
  { studentId, value }: MarkHistory,
  marks: IMarksByDate,
): void {
  const mark: Mark = marks[source][studentId];
  mark.date = current;
  mark.value = value;
  updated.push(mark);
}

function chooseAction(
  { source }: TableConfigHistory,
  { studentId, isDeleted }: MarkHistory,
  marks: IMarksByDate,
): Actions {
  if (!marks[source]) {
    return Actions.create;
  }

  const mark: Mark = marks[source][studentId];
  if (!mark && isDeleted) {
    return;
  }
  if (!mark && !isDeleted) {
    return Actions.create;
  }
  if (isDeleted && mark) {
    return Actions.delete;
  }

  return Actions.update;
}

function action(
  tableHistory: TableConfigHistory,
  marks: IMarksByDate,
): (markHistory: MarkHistory) => void {
  return (markHistory: MarkHistory): void => {
    switch (chooseAction(tableHistory, markHistory, marks)) {
      case Actions.create:
        created.push(createMark(tableHistory, markHistory));
        break;
      case Actions.update:
        updateMark(tableHistory, markHistory, marks);
        break;
      case Actions.delete:
        deleted.push(getMark(tableHistory, markHistory, marks));
        break;
      default:
        return;
    }
  };
}

function process(history: Array<TableConfigHistory>, marks: IMarksByDate): void {
  history.forEach((tableHistory) => {
    if (tableHistory.isDeleted) {
      return deleteMarksByDate(tableHistory.source, marks);
    }

    tableHistory.marks.forEach(action(tableHistory, marks));
  });
}

export function convert(
  history: Array<TableConfigHistory>,
  marks: IMarksByDate,
  idSubject: number,
): IDataChanges<Mark> {
  created = [];
  updated = [];
  deleted = [];
  subjectId = idSubject;

  process(history, marks);

  return {
    created,
    updated,
    deleted,
  };
}
