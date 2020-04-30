import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouteService } from '@shared/services/route.service';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { AddIncomeComponent } from '../income/components/add-income/add-income.component';
import { AddExpenseComponent } from '../expenses/components/add-expense/add-expense.component';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    public routeService: RouteService,
  ) { }

  ngOnInit(): void {
  }

  onAdd(action: string): void {
    let dialogRef: MatDialogRef<any>;
    switch(action) {
      case 'income': dialogRef = this.dialog.open(AddIncomeComponent); break;
      case 'expenses': dialogRef = this.dialog.open(AddExpenseComponent); break;
    }
  }

}
