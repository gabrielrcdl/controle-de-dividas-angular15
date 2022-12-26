import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './shared/material-module/material.module';
import { LoginComponent } from './components/login/login.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ContinuationRegisterComponent } from './components/continuation-register/continuation-register.component';

@NgModule({
  declarations: [AppComponent, LoginComponent, ContinuationRegisterComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  providers: [],

  bootstrap: [AppComponent],
})
export class AppModule {}
