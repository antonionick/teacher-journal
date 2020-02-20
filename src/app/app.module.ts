import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './root/app.component';
import { PanelComponent } from './components/panel/panel.component';
import { StudentFormComponent } from './components/students/student-form/student-form.component';
import { StudentTableComponent } from './components/students/student-table/student-table.component';
import { StudentPageComponent } from './components/students/student-page/student-page.component';

@NgModule({
  declarations: [AppComponent, PanelComponent, StudentFormComponent, StudentTableComponent, StudentPageComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
