import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './shared/services/auth.service';
import { IncomeComponent } from './pages/income/income.component';
import { LoginComponent } from './pages/login/login.component';


const routes: Routes = [
    { path: '', redirectTo: 'income', pathMatch: 'full' },
    { path: 'income', component: IncomeComponent, canActivate: [AuthGuard] },
    // { path: 'expenses', component: ExpensesComponent, canActivate: [AuthGuard] },
    // { path: 'stock', component: StockComponent, canActivate: [AuthGuard] },
    // { path: 'vat', component: VatComponent, canActivate: [AuthGuard] },
    // { path: 'tax', component: TaxComponent, canActivate: [AuthGuard] },
    // { path: 'contact', component: ContactComponent },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: 'income' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
