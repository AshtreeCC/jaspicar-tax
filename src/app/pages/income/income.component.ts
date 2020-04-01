import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DataService } from '@shared/services/data.service';

import { AddIncomeComponent } from './components/add-income/add-income.component';
import { AddExpenseComponent } from '../expenses/components/add-expense/add-expense.component';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeComponent implements OnInit, OnDestroy {

  private destroy$: Subject<boolean> = new Subject<boolean>();
  
  loading$: Subject<boolean> = new Subject<boolean>();
  categoryLoading$: Subject<boolean> = new Subject<boolean>();

  periodStart: Date;
  periodUntil: Date;

  incomeData: string;
  incomeCategories: string;

  simplifiedCategories = {};

  displayedColumns = [
    'invoice', 
    'date', 
    'category', 
    'description', 
    'vattable', 
    'amount', 
    'vat', 
    'net'
  ];
  
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor(
    private dataService: DataService,
    private router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    // Initialise date range
    this.periodStart = new Date('2020-02-01 00:00:00');
    this.periodUntil = new Date(this.periodStart);
    this.periodUntil.setMonth(this.periodStart.getMonth() + 2);

    // Subscribe to database
    this.getIncomeData();
  }

  getIncomeData() {
    this.loading$.next(true);
    this.dataService.getIncome(this.periodStart).pipe(
      takeUntil(this.destroy$),
    ).subscribe(data => {
      this.dataSource = data;
      this.loading$.next(false);
    });
  }

  gotoExpenses() {
    this.router.navigateByUrl('/expenses');
    const dialogRef: MatDialogRef<any> = this.dialog.open(AddExpenseComponent);
  }

  openAddDialog(): void {
    const dialogRef: MatDialogRef<any> = this.dialog.open(AddIncomeComponent);
    
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
        
    //   }
    // });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
