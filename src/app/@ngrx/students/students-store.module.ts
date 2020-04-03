import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { studentsReducer } from './students.reducer';
import { StudentsEffects } from './students.effects';

@NgModule({
  imports: [
    StoreModule.forFeature('students', studentsReducer),
    EffectsModule.forFeature([StudentsEffects]),
  ],
})
export class StudentsStoreModule {}
