import { Component, OnInit, ChangeDetectionStrategy, Inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

import { Subject } from 'rxjs';

import { DataService } from '@shared/services/data.service';

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddExpenseComponent implements OnInit {

  // @ViewChild('form') form: NgForm;

  addExpenseForm: FormGroup
  keepAlive: boolean;

  reset$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddExpenseComponent>,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.addExpenseForm = this.createForm();
  }

  createForm(): any {
    return this.fb.group({
      expenseForm: [],
    });
  }

  onSubmit(form: any): void {
    const expenseForm = form.form.get('expenseForm');
    let snackBarRef: MatSnackBarRef<any>;

    this.dataService.addExpense(expenseForm.value);

    snackBarRef = this.snackBar.open(`Expense for Invoice #${expenseForm.value['invoice']} added`, '', { duration: 6000 });
    this.reset$.next(true);
    this.changeDetectorRef.markForCheck();

    // Close the dialog after successful submit
    if (!this.keepAlive) {
      this.dialogRef.close(true);
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
