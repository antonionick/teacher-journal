import { Pipe, PipeTransform } from '@angular/core';
import { TNullable } from '../models/utils';

@Pipe({
  name: 'main',
})
export class MainPipe implements PipeTransform {
  public transform(value: string, pipe: TNullable<PipeTransform>, args: string = ''): string {
    if (pipe === null) {
      return value;
    }

    return pipe.transform(value, args);
  }
}
