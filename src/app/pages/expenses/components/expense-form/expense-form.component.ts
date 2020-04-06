import { Component, OnInit, OnChanges, Input, forwardRef, ViewChild, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ControlValueAccessor, Validator, ValidationErrors, AbstractControl } from '@angular/forms';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Observable, BehaviorSubject, Subject, of } from 'rxjs';

import { ExpenseModel } from '@shared/models/expense.model';
import { DataService } from '@shared/services/data.service';

import { AddCategoryComponent } from '@shared/components/add-category/add-category.component';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.scss'],
  providers: [
    {
   provide: NG_VALUE_ACCESSOR,
   useExisting: forwardRef(() => ExpenseFormComponent),
   multi: true
 },
  {
   provide: NG_VALIDATORS,
   useExisting: forwardRef(() => ExpenseFormComponent),
   multi: true
 }
]
})
export class ExpenseFormComponent implements OnInit, OnChanges, ControlValueAccessor, Validator {

  @ViewChild('form', {static: false}) form: NgForm;
  @Input('reset') reset$: Observable<boolean>;
  @Input() data: ExpenseModel;

  expenseForm: FormGroup;
  changeVAT: boolean = false;

  categories$: Observable<any[]>;

  loading$: Subject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.expenseForm = this.createForm();
    this.categories$ = this.dataService.getCategories('expenses');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.expenseForm = this.createForm();
    }

    if (changes.reset$) {
      this.reset$.subscribe(value => {
        this.form.resetForm();
        this.expenseForm.get('vat').setValue('Incl.');
        this.expenseForm.get('vatRate').setValue(this.dataService.vatRate);
      });
    }
  }

  public onTouched: () => void = () => {};

  writeValue(val: any): void {
    val && this.expenseForm.setValue(val, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    // On Change
    this.expenseForm.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    // On Blur
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.expenseForm.disable() : this.expenseForm.enable();
  }

  validate(c: AbstractControl): ValidationErrors | null{
    return this.expenseForm.valid ? null : { invalidForm: {valid: false, message: "Expense form fields are invalid"}};
  }

  createForm(): any {
    const expense = {
      id          : this.data ? this.data.id                                     : '',
      invoice     : this.data ? this.data.invoice                                : '',
      date        : this.data ? new Date((this.data.date as any).seconds * 1000) : '',
      categoryID  : this.data ? this.data.categoryID                             : '',
      description : this.data ? this.data.description                            : '',
      vatRate     : this.data && this.data.vatRate ? this.data.vatRate           : this.dataService.vatRate,
      vat         : this.data && this.data.vat ? this.data.vat                   : 'Incl.',
      amount      : this.data ? this.data.amount                                 : '',
    }

    this.loading$.next(false);
    return this.fb.group({
        id          : [ expense.id ],
        invoice     : [ expense.invoice, Validators.required ],
        date        : [ expense.date, Validators.required ],
        categoryID  : [ expense.categoryID, Validators.required ],
        description : [ expense.description ],
        vatRate     : [ expense.vatRate ],
        vat         : [ expense.vat ],
        amount      : [ expense.amount, [ Validators.required, Validators.pattern(/^\d+(\.\d)?\d?$/) ] ],
    });
  }

  openCategoryDialog(event: Event): void {
    event.stopPropagation();
    const dialogRef: MatDialogRef<any> = this.dialog.open(AddCategoryComponent, {
      data: {
        formType: 'expenses',
      },
      backdropClass: '-blur',
      position: {
        left: '60%',
      },
    });
  }

}
