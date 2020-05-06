import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';

import { Subject, Subscription } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { IncomeModel } from '@shared/models/income.model';
import { DataService } from '@shared/services/data.service';
import { RouteService } from '@shared/services/route.service';

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
  
  loading$: Subject<boolean> = new Subject<boolean>();
  categoryLoading$: Subject<boolean> = new Subject<boolean>();

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

  year: string;

  private _destroy$: Subject<boolean> = new Subject<boolean>();
  private _routeSubscription: Subscription;

  constructor(
    private router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public dataService: DataService,
    private routeService: RouteService,
  ) { }

  ngOnInit(): void {
    // Initialise date range
    this._routeSubscription = this.routeService.url$
    .subscribe(url => {
      if (this.year != url.year) {
        this.year = url.year;
        this._destroy$.next(true);
        this.getIncomeData(url.year);
      }
    });
    
  }

  getIncomeData(year: string) {
    this.loading$.next(true);
    const periodStart = new Date(`${year}-03-01`);
    const periodUntil = new Date(`${Number(year) + 1}-02-01`);
    this.dataService.getIncome(periodStart, periodUntil).pipe(
      takeUntil(this._destroy$),
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

  openDialog(action: string, income: IncomeModel = null): void {
    let dialogRef: MatDialogRef<any>

    switch(action) {
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
    console.log('>>> destroy income')
    this._destroy$.next(true);
    this._destroy$.unsubscribe();
    this._routeSubscription.unsubscribe();
  }
}
