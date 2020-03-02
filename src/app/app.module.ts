import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { MatChipsModule } from '@angular/material/chips';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormBuilder } from '@angular/forms';

import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './root/app.component';
import { PanelComponent } from './components/panel/panel.component';
import { StudentFormComponent } from './components/students/student-form/student-form.component';
import { StudentTableComponent } from './components/students/student-table/student-table.component';
import { StudentPageComponent } from './components/students/student-page/student-page.component';
import { StudentService } from './common/services/student.service';

@NgModule({
  declarations: [AppComponent, PanelComponent, StudentFormComponent, StudentTableComponent, StudentPageComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, MatChipsModule, SharedModule, FontAwesomeModule, HttpClientModule],
  providers: [FormBuilder, StudentService],
  bootstrap: [AppComponent],
})
export class AppModule {}
