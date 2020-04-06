import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DataService } from '@shared/services/data.service';

@Component({
  selector: 'app-edit-expense',
  templateUrl: './edit-expense.component.html',
  styleUrls: ['./edit-expense.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditExpenseComponent implements OnInit {

  editExpenseForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditExpenseComponent>,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.editExpenseForm = this.createForm();
  }

  createForm(): any {
    return this.fb.group({
      expenseForm: [],
    });
  }

  onSubmit(form: any): void {
    let result = true;
    const expenseForm = form.form.get('expenseForm');
    this.dataService.setExpense(expenseForm.value);

    if (result) {
      let snackBarRef = this.snackBar.open(`Expense for Invoice #${expenseForm.value['invoice']} updated`, '', { duration: 6000 });
      this.dialogRef.close(true);
    }
      
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
