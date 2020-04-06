import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortable } from '@angular/material/sort';

import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { IncomeModel } from '@shared/models/income.model';
import { DataService } from '@shared/services/data.service';

import { AddIncomeComponent } from './components/add-income/add-income.component';
import { AddExpenseComponent } from '../expenses/components/add-expense/add-expense.component';
import { EditIncomeComponent } from './components/edit-income/edit-income.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';

interface Total {
  amount: number,
  vat: number,
  net: number,
}

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeComponent implements OnInit, OnDestroy {

  @ViewChild(MatSort, {static: true}) sort: MatSort;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  
  loading$: Subject<boolean> = new Subject<boolean>();
  categoryLoading$: Subject<boolean> = new Subject<boolean>();

  periodStart: Date;
  periodUntil: Date;

  incomeData: string;
  incomeCategories: string;

  simplifiedCategories = {};

  displayedColumns = [
    'index',
    'invoice', 
    'date', 
    'category', 
    'description', 
    'vat', 
    'amount', 
    'autoVat', 
    'autoNet',
    'edit',
  ];

  total: Total = {
    amount: 0,
    vat: 0,
    net: 0,
  };
  
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  rowHoverIndex: number;

  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dataService: DataService,
  ) { }

  ngOnInit(): void {
    // Initialise date range
    this.onChangePeriod('2020-03-01');
  }

  onChangePeriod(start: string): void {
    this.periodStart = new Date(start + ' 00:00:00');
    this.periodUntil = new Date(this.periodStart);
    this.periodUntil.setFullYear(this.periodStart.getFullYear() + 1);
    this.periodUntil.setDate(this.periodUntil.getDate() - 1);
    
    // Subscribe to database
    this.destroy$.next(true);
    this.getIncomeData();
  }

  getIncomeData() {
    this.loading$.next(true);
    this.dataService.getIncome(this.periodStart, this.periodUntil).pipe(
      takeUntil(this.destroy$),
    ).pipe(
      tap(data => {
        this.total = data.reduce((total: Total, data: IncomeModel) => {
          total.amount += Number(data.amount);
          total.vat += Number(data.autoVat);
          total.net += Number(data.autoNet);
          return total;
        }, { amount: 0, vat: 0, net: 0 } as Total)
      }),
      tap(data => {
        this.dataSource = data;
        this.dataSource.sort = this.sort;
      }),
    ).subscribe( () => this.loading$.next(false) );
  }

  gotoExpenses() {
    this.router.navigateByUrl('/expenses');
    const dialogRef: MatDialogRef<any> = this.dialog.open(AddExpenseComponent);
  }

  openDialog(action: string, income: IncomeModel = null): void {
    let dialogRef: MatDialogRef<any>

    switch(action) {
      case 'Add': dialogRef = this.dialog.open(AddIncomeComponent, { data: income }); break;
      case 'Edit': dialogRef = this.dialog.open(EditIncomeComponent, { data: income }); break;
      case 'Confirm': dialogRef = this.dialog.open(ConfirmDialogComponent, { data: income }); break;
    }

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (action === 'Confirm') {
          this.dataService.deleteIncome(income);
          let snackBarRef = this.snackBar.open(`Income for Invoice # ${income.invoice} removed`, '', { duration: 6000 });
        }
      }
    });
  }

  onHover(i: number) {
    this.rowHoverIndex = i + 1;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
