import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '@shared/services/data.service';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddIncomeComponent } from './components/add-income/add-income.component';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeComponent implements OnInit, OnDestroy {

  private destroy$: Subject<boolean> = new Subject<boolean>();

  periodStart: Date;
  periodUntil: Date;

  incomeData: string;
  incomeCategories: string;

  simpleCats = [];

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
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    // Initialise date range
    this.periodStart = new Date('2020-02-01 00:00:00');
    this.periodUntil = new Date(this.periodStart);
    this.periodUntil.setMonth(this.periodStart.getMonth() + 2);

    // Subscribe to database
    this.dataService.getIncome(this.periodStart).pipe(
      takeUntil(this.destroy$),
    ).subscribe(data => {
      this.dataSource = data;
    });
  }

  openAddDialog(): void {
    let dialogRef: MatDialogRef<any>;
    dialogRef = this.dialog.open(AddIncomeComponent);
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let snackBarRef = this.snackBar.open('Income added', '', { duration: 6000 });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
