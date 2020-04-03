import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { marksReducer } from './marks.reducer';
import { MarksEffects } from './marks.effects';

@NgModule({
  declarations: [],
  imports: [
    StoreModule.forFeature('marks', marksReducer),
    EffectsModule.forFeature([MarksEffects]),
  ],
})
export class MarksStoreModule { }
