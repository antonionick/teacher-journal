import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { subjectsReducer } from './subjects.reducer';
import { SubjectsEffects } from './subjects.effects';

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forFeature('subjects', subjectsReducer),
    EffectsModule.forFeature([SubjectsEffects]),
  ],
})
export class SubjectsStoreModule { }
