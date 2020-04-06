import { Component, OnInit, ChangeDetectionStrategy, Inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

import { Subject } from 'rxjs';

import { DataService } from '@shared/services/data.service';

@Component({
  selector: 'app-add-income',
  templateUrl: './add-income.component.html',
  styleUrls: ['./add-income.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIncomeComponent implements OnInit {

  // @ViewChild('form') form: NgForm;

  addIncomeForm: FormGroup
  keepAlive: boolean;

  reset$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private changeDetectorRef: ChangeDetectorRef,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddIncomeComponent>,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.addIncomeForm = this.createForm();
  }

  createForm(): any {
    return this.fb.group({
      incomeForm: [],
    });
  }

  onSubmit(form: any): void {
    const incomeForm = form.form.get('incomeForm');
    let snackBarRef: MatSnackBarRef<any>;

    this.dataService.addIncome(incomeForm.value);

    snackBarRef = this.snackBar.open(`Income for Invoice #${incomeForm.value['invoice']} added`, '', { duration: 6000 });
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
