import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

import { StoreModule } from '@ngrx/store';

import { StudentsStoreModule } from './students/students-store.module';
import { SubjectsStoreModule } from './subjects/subjects-store.module';
import { MarksStoreModule } from './marks/marks-store.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot({}, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    EffectsModule.forRoot([]),
    StudentsStoreModule,
    SubjectsStoreModule,
    MarksStoreModule,
    environment.production ? [] : StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
  ],
})
export class RootStoreModule {}
