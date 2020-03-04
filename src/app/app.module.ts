import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { StudentsModule } from './components/students/students.module';
import { SharedModule } from './shared/shared.module';
import { AppComponent } from './root/app.component';
import { PanelComponent } from './components';

@NgModule({
  declarations: [AppComponent, PanelComponent, AppRoutingModule.components],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTabsModule,
    SharedModule,
    FontAwesomeModule,
    StudentsModule,
    AppRoutingModule,
  ],
  providers: [FormBuilder],
  bootstrap: [AppComponent],
})
export class AppModule { }
