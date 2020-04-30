import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './shared/services/auth.service';
import { TaxComponent } from './pages/tax/tax.component';
import { IncomeComponent } from './pages/income/income.component';
import { LoginComponent } from './pages/login/login.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { VatComponent } from './pages/vat/vat.component';
import { ScheduleComponent } from './pages/schedule/schedule.component';


const routes: Routes = [
    { path: '', redirectTo: `tax/${(new Date()).getFullYear()}`, pathMatch: 'full' },
    { path: 'tax/:year', component: TaxComponent, canActivate: [AuthGuard], children: [
      { path: 'income', component: IncomeComponent },
      { path: 'expenses', component: ExpensesComponent },
      { path: 'schedule', component: ScheduleComponent },
    ]},
    { path: 'vat/:year', component: VatComponent, canActivate: [AuthGuard] },
    // { path: 'stock', component: StockComponent, canActivate: [AuthGuard] },
    // { path: 'contact', component: ContactComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: 'income' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
