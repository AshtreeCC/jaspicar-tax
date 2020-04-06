import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Subject, BehaviorSubject } from 'rxjs';

import { DataService } from '@shared/services/data.service';

@Component({
  selector: 'app-edit-income',
  templateUrl: './edit-income.component.html',
  styleUrls: ['./edit-income.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditIncomeComponent implements OnInit {

  editIncomeForm: FormGroup

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<EditIncomeComponent>,
    public snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
    this.editIncomeForm = this.createForm();
  }

  createForm(): any {
    return this.fb.group({
      incomeForm: [],
    });
  }

  onSubmit(form: any): void {
    let result = true;
    const incomeForm = form.form.get('incomeForm');
    this.dataService.setIncome(incomeForm.value);

    if (result) {
      let snackBarRef = this.snackBar.open(`Income for Invoice #${incomeForm.value['invoice']} updated`, '', { duration: 6000 });
      this.dialogRef.close(true);
    }
      
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
