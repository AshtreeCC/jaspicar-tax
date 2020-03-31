import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-income',
  templateUrl: './add-income.component.html',
  styleUrls: ['./add-income.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIncomeComponent implements OnInit {

  incomeForm: FormGroup;

  categories = [];

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddIncomeComponent>,
  ) { }

  ngOnInit(): void {
    this.incomeForm = this.createAddForm();
  }

  createAddForm(): any {
    return this.fb.group({
      invoice     : ['', Validators.required],
      date        : ['', Validators.required],
      category_id : ['', Validators.required],
      description : [''],
      vat         : ['', Validators.required],
      amount      : ['', [Validators.required, Validators.pattern(/^\d+(\.\d)?\d?$/)]]
    });
  }

  openCategoryDialog(): void {

  }

  onSubmit(): void {
    console.log(this.incomeForm);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
