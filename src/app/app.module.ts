import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';

import { ServiceWorkerModule } from '@angular/service-worker';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MaterialModule } from '@shared/modules/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PDFExportModule } from '@progress/kendo-angular-pdf-export';

import { CustomReuseStrategy } from '@shared/services/route.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';

import { LoginComponent } from './pages/login/login.component';
import { TaxComponent } from './pages/tax/tax.component';
import { VatComponent } from './pages/vat/vat.component';
import { IncomeComponent } from './pages/income/income.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';

import { AddCategoryComponent } from './shared/components/add-category/add-category.component';
import { AddIncomeComponent } from './pages/income/components/add-income/add-income.component';
import { AddExpenseComponent } from './pages/expenses/components/add-expense/add-expense.component';
import { EditIncomeComponent } from './pages/income/components/edit-income/edit-income.component';
import { IncomeFormComponent } from './pages/income/components/income-form/income-form.component';
import { EditExpenseComponent } from './pages/expenses/components/edit-expense/edit-expense.component';
import { ExpenseFormComponent } from './pages/expenses/components/expense-form/expense-form.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    IncomeComponent,
    AddIncomeComponent,
    AddCategoryComponent,
    ExpensesComponent,
    AddExpenseComponent,
    EditIncomeComponent,
    IncomeFormComponent,
    ConfirmDialogComponent,
    ExpenseFormComponent,
    EditExpenseComponent,
    TaxComponent,
    VatComponent,
    ScheduleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    PDFExportModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: CustomReuseStrategy },
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule { }
