import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { RouteService } from '@shared/services/route.service';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { AddIncomeComponent } from '../income/components/add-income/add-income.component';
import { AddExpenseComponent } from '../expenses/components/add-expense/add-expense.component';
import { DataService } from '@shared/services/data.service';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ExpenseModel } from '@shared/models/expense.model';
import { IncomeModel } from '@shared/models/income.model';

interface AmountModel {
  amount: number,
  vat: number,
  net: number,
}

@Component({
  selector: 'app-vat',
  templateUrl: './vat.component.html',
  styleUrls: ['./vat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VatComponent implements OnInit, OnDestroy {

  private _destroy$: Subject<boolean> = new Subject<boolean>();
  private _routeSubscription: Subscription;

  income: AmountModel[];
  expenses: AmountModel[];

  incomeTotal: AmountModel = this.initialise();
  expenseTotal: AmountModel = this.initialise();

  constructor(
    public dialog: MatDialog,
    public routeService: RouteService,
    private dataService: DataService,
    private changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    // Initialise date range
    this._routeSubscription = this.routeService.url$
    .subscribe(url => {
        this._destroy$.next(true);
        this.getData(url.year, url.view);
    });
  }

  initialise(): AmountModel {
    return {
      amount: 0,
      vat: 0,
      net: 0,
    } as AmountModel;
  }

  sum(category: string, res: any, val: IncomeModel): AmountModel {
    return {
      amount: res[category].amount + Number(val.amount),
      vat: res[category].vat + Number(val.autoVat),
      net: res[category].net + Number(val.autoNet),
    } as AmountModel;
  }

  getData(year: string, month: string) {
    const periodStart = new Date(`${year}-${month}-01`);
    const periodUntil = new Date(periodStart)
    periodUntil.setMonth(periodStart.getMonth() + 2);
    // Income
    this.dataService.getIncome(periodStart, periodUntil, true).pipe(
      takeUntil(this._destroy$),
    ).subscribe((data: IncomeModel[]) => {
      this.income = data.reduce((res: any, val: IncomeModel) => {
        if (!res[val.category]) {
          res[val.category] = this.initialise();
        }
        res[val.category] = this.sum(val.category, res, val);
        res['Total'] = this.sum('Total', res, val);
        return res;
      }, {'Total': this.initialise()});
      this.incomeTotal = this.income['Total'];
      delete this.income['Total'];
      this.changeDetectorRef.markForCheck();
      console.log(this.income);
    });
    // Expenses
    this.dataService.getExpenses(periodStart, periodUntil, true).pipe(
      takeUntil(this._destroy$),
    ).subscribe(data => {
      this.expenses = data.reduce((res: any, val: IncomeModel) => {
        if (!res[val.category]) {
          res[val.category] = this.initialise();
        }
        res[val.category] = this.sum(val.category, res, val);
        res['Total'] = this.sum('Total', res, val);
        return res;
      }, {'Total': this.initialise()});
      this.expenseTotal = this.expenses['Total'];
      delete this.expenses['Total'];
      this.changeDetectorRef.markForCheck();
      console.log(this.expenses);
    });
  }

  onAdd(action: string): void {
    let dialogRef: MatDialogRef<any>;
    switch(action) {
      case 'income': dialogRef = this.dialog.open(AddIncomeComponent); break;
      case 'expenses': dialogRef = this.dialog.open(AddExpenseComponent); break;
    }
  }

  ngOnDestroy() {
    this._routeSubscription.unsubscribe();
  }

}
