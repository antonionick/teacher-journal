import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { studentsReducer, StudentsEffects } from './';

@NgModule({
  imports: [
    StoreModule.forFeature('students', studentsReducer),
    EffectsModule.forFeature([StudentsEffects]),
  ],
})
export class StudentsStoreModule {}
