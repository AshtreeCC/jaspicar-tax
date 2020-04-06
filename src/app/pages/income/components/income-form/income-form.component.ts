import { Component, OnInit, OnChanges, Input, forwardRef, ViewChild, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, NgForm } from '@angular/forms';
import { ControlValueAccessor, Validator, ValidationErrors, AbstractControl } from '@angular/forms';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Observable, BehaviorSubject, Subject, of } from 'rxjs';

import { IncomeModel } from '@shared/models/income.model';
import { DataService } from '@shared/services/data.service';

import { AddCategoryComponent } from '@shared/components/add-category/add-category.component';

@Component({
  selector: 'app-income-form',
  templateUrl: './income-form.component.html',
  styleUrls: ['./income-form.component.scss'],
  providers: [
    {
   provide: NG_VALUE_ACCESSOR,
   useExisting: forwardRef(() => IncomeFormComponent),
   multi: true
 },
  {
   provide: NG_VALIDATORS,
   useExisting: forwardRef(() => IncomeFormComponent),
   multi: true
 }
]
})
export class IncomeFormComponent implements OnInit, OnChanges, ControlValueAccessor, Validator {

  @ViewChild('form', {static: false}) form: NgForm;
  @Input('reset') reset$: Observable<boolean>;
  @Input() data: IncomeModel;

  incomeForm: FormGroup;
  changeVAT: boolean = false;

  categories$: Observable<any[]>;

  loading$: Subject<boolean> = new BehaviorSubject<boolean>(true);

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.incomeForm = this.createForm();
    this.categories$ = this.dataService.getCategories('income');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.incomeForm = this.createForm();
    }

    if (changes.reset$) {
      this.reset$.subscribe(value => {
        this.form.resetForm();
        this.incomeForm.get('vat').setValue('Incl.');
        this.incomeForm.get('vatRate').setValue(this.dataService.vatRate);
      });
    }
  }

  public onTouched: () => void = () => {};

  writeValue(val: any): void {
    val && this.incomeForm.setValue(val, { emitEvent: false });
  }

  registerOnChange(fn: any): void {
    // On Change
    this.incomeForm.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    // On Blur
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.incomeForm.disable() : this.incomeForm.enable();
  }

  validate(c: AbstractControl): ValidationErrors | null{
    return this.incomeForm.valid ? null : { invalidForm: {valid: false, message: "Income form fields are invalid"}};
  }

  createForm(): any {
    const income = {
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
        id          : [ income.id ],
        invoice     : [ income.invoice, Validators.required ],
        date        : [ income.date, Validators.required ],
        categoryID  : [ income.categoryID, Validators.required ],
        description : [ income.description ],
        vatRate     : [ income.vatRate ],
        vat         : [ income.vat ],
        amount      : [ income.amount, [ Validators.required, Validators.pattern(/^\d+(\.\d)?\d?$/) ] ],
    });
  }

  openCategoryDialog(event: Event): void {
    event.stopPropagation();
    const dialogRef: MatDialogRef<any> = this.dialog.open(AddCategoryComponent, {
      data: {
        formType: 'income',
      },
      backdropClass: '-blur',
      position: {
        left: '60%',
      },
    });
  }

}
