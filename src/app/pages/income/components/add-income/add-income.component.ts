import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddCategoryComponent } from '@shared/components/add-category/add-category.component';
import { Observable } from 'rxjs';
import { DataService } from '@shared/services/data.service';

@Component({
  selector: 'app-add-income',
  templateUrl: './add-income.component.html',
  styleUrls: ['./add-income.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIncomeComponent implements OnInit {

  incomeForm: FormGroup;
  keepAlive: boolean = false;

  categories$: Observable<any[]>;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AddIncomeComponent>,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.incomeForm = this.createAddForm();
    this.categories$ = this.dataService.getCategories('income');
  }

  createAddForm(): any {
    return this.fb.group({
      invoice     : ['', Validators.required],
      date        : ['', Validators.required],
      categoryID  : ['', Validators.required],
      description : [''],
      vat         : ['Incl.'],
      amount      : ['', [Validators.required, Validators.pattern(/^\d+(\.\d)?\d?$/)]]
    });
  }

  openCategoryDialog(event: Event): void {
    event.stopPropagation();
    const dialogRef: MatDialogRef<any> = this.dialog.open(AddCategoryComponent, {
      data: {
        form: 'income',
      },
      backdropClass: '-blur',
    });
  }

  onSubmit(form: any): void {
    let result = true;
    this.dataService.addIncome(form.value);

    if (result) {
      let snackBarRef = this.snackBar.open('Income added', '', { duration: 6000 });
      form.form.markAsPristine();
      form.resetForm();
    }

    // Close the dialog after successful submit
    if (!this.keepAlive) {
      this.dialogRef.close(true);
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

}
