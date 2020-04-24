import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { StudentsModule } from './students/students.module';
import { SubjectsModule } from './subjects/subjects.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './root/app.component';
import { PanelComponent, BaseComponent, BreadcrumbsComponent } from './components';
import { RootStoreModule } from './@ngrx/root-store.module';

@NgModule({
  declarations: [
    AppComponent,
    PanelComponent,
    BaseComponent,
    BreadcrumbsComponent,
    AppRoutingModule.components,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    HttpClientModule,
    MatTabsModule,
    SharedModule,
    StudentsModule,
    SubjectsModule,
    RootStoreModule,
    AppRoutingModule,
  ],
  providers: [FormBuilder],
  bootstrap: [AppComponent],
})
export class AppModule {}
