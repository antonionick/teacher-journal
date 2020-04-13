import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { routerReducers, CustomSerializer } from './router';

import { StudentsStoreModule } from './students/students-store.module';
import { SubjectsStoreModule } from './subjects/subjects-store.module';
import { MarksStoreModule } from './marks/marks-store.module';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot(routerReducers, {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
      },
    }),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomSerializer,
    }),
    StudentsStoreModule,
    SubjectsStoreModule,
    MarksStoreModule,
    environment.production ? [] : StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
  ],
})
export class RootStoreModule {}
