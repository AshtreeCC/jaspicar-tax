import { Injectable } from '@angular/core';

import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import 'firebase/firestore';

import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AuthService } from './auth.service';

import { IncomeModel, IncomeForm } from '@shared/models/income.model';
import { ExpenseModel, ExpenseForm } from '@shared/models/expense.model';
import { CategoryModel } from '@shared/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  vatRate: number = 15; // Percent

  constructor(
    private af: AngularFirestore,
    private authService: AuthService,
  ) { }

  // INCOME

  // Add
  addIncome(income: IncomeModel) {
    let form: IncomeModel = new IncomeForm(income);
    this.af.collection('tax')
      .doc(this.authService.currentUserId)
      .collection('income').add({
        invoice: form.invoice,
        date: form.date,
        categoryID: form.categoryID,
        description: form.description,
        vatRate: Number(form.vatRate),
        vat: form.vat,
        amount: Number(form.amount),
      } as IncomeModel);
  }

  // Update
  setIncome(income: IncomeModel) {
    this.af.collection('tax')
      .doc(this.authService.currentUserId)
      .collection('income').doc(income.id).set({
        invoice: income.invoice,
        date: income.date,
        categoryID: income.categoryID,
        description: income.description,
        vatRate: Number(income.vatRate),
        vat: income.vat,
        amount: Number(income.amount),
      } as IncomeModel);
  }

  // Get
  getIncome(periodStart: Date, periodUntil: Date): Observable<any> {
    const income$ = this.af.collection('tax')
      .doc(this.authService.currentUserId)
      .collection('income', ref => ref
        .where('date', '>=', periodStart)
        .where('date', '<', periodUntil)
        .orderBy('date', 'desc')
    ).snapshotChanges().pipe(
      map((data: any) => {
        let index: number = 1;
        return data.map(res => {
          return {
            index: index++,
            id: res.payload.doc.id,
            ...res.payload.doc.data(),
          };
        });
      }),
      map(data => data.map(income => {
          return {
            ...income,
            autoNet: income.autoNet = this.calculateNet(income.vat, income.amount, income.vatRate),
            autoVat: income.autoVat = this.calculateVat(income.amount, income.autoNet),
          }
        })
      ),
      // tap(console.log),
    );

    const categories$ = this.getCategories('income');

    return combineLatest<DocumentData[], DocumentData[]>(income$, categories$).pipe(
      map((data: any) => {
        let [allIncome, categories] = data;
        return allIncome.map(income => {
          const cat = categories.find(category => category.id == income.categoryID);
          return {
            category: cat ? cat.name : 'N/A',
            vatRate: income.vatRate || this.vatRate,
            ...income,
          }
        });
      }),
    );
  }

  // Delete
  deleteIncome(income: IncomeModel) {
    this.af.collection('tax')
      .doc(this.authService.currentUserId)
      .collection('income').doc(income.id).delete();
  }

  // EXPENSES

  // Add
  addExpense(expense: ExpenseModel) {
    let form: ExpenseModel = new ExpenseForm(expense);
    this.af.collection('tax')
      .doc(this.authService.currentUserId)
      .collection('expenses').add({
        invoice: form.invoice,
        date: form.date,
        categoryID: form.categoryID,
        description: form.description,
        vatRate: Number(form.vatRate),
        vat: form.vat,
        amount: Number(form.amount),
      } as ExpenseModel);
  }

  // Update
  setExpense(expense: ExpenseModel) {
    this.af.collection('tax')
      .doc(this.authService.currentUserId)
      .collection('expenses').doc(expense.id).set({
        invoice: expense.invoice,
        date: expense.date,
        categoryID: expense.categoryID,
        description: expense.description,
        vatRate: Number(expense.vatRate),
        vat: expense.vat,
        amount: Number(expense.amount),
      } as IncomeModel);
  }

  // Get
  getExpenses(periodStart: Date, periodUntil: Date): Observable<any> {
    const expenses$ = this.af.collection('tax')
      .doc(this.authService.currentUserId)
      .collection('expenses', ref => ref
      .where('date', '>=', periodStart)
      .where('date', '<', periodUntil)
        .orderBy('date', 'desc')
      ).snapshotChanges().pipe(
        map((data: any) => {
          let index: number = 1;
          return data.map(res => {
            return {
              index: index++,
              id: res.payload.doc.id,
              ...res.payload.doc.data(),
            };
          });
        }),
        map(data => data.map(expense => {
            return {
              ...expense,
              autoNet: expense.autoNet = this.calculateNet(expense.vat, expense.amount, expense.vatRate),
              autoVat: expense.autoVat = this.calculateVat(expense.amount, expense.autoNet),
            }
          })
        ),
        // tap(console.log),
      );

    const categories$ = this.getCategories('expenses');

    return combineLatest<DocumentData[], DocumentData[]>(expenses$, categories$).pipe(
      map((data: any) => {
        let [allExpenses, categories] = data;
        return allExpenses.map(expenses => {
          const cat = categories.find(category => category.id == expenses.categoryID);
          return {
            category: cat ? cat.name : 'N/A',
            vatRate: expenses.vatRate || this.vatRate,
            ...expenses,
          }
        });
      }),
    );
  }

    // Delete
    deleteExpense(expense: ExpenseModel) {
      this.af.collection('tax')
        .doc(this.authService.currentUserId)
        .collection('expenses').doc(expense.id).delete();
    }

  // CATEGORIES

  // Add
  addCategory(name: string, form: string): void {
    this.af.collection('tax')
      .doc(this.authService.currentUserId)
      .collection('categories').add({ name, form });
  }

  // Update
  setCategory(category: CategoryModel): void {
    this.af.collection('tax')
      .doc(this.authService.currentUserId)
      .collection('categories').doc(category.id).set({
        name: category.name,
        form: category.form,
      });
  }

  // Get
  getCategories(formType: string): Observable<any> {
    return this.af.collection('tax')
      .doc(this.authService.currentUserId)
      .collection('categories', ref => ref
        .where('form', '==', formType)
      )
      .snapshotChanges()
      .pipe(
        map((data: any) => data.map(res => {
            return {
              id: res.payload.doc.id,
              ...res.payload.doc.data(),
            };
          }),
        ),
        map((data: any) => data.sort(
          (a, b) => (a.name > b.name) ? 1 : -1)
        ),
      );
  }

  // Delete
  deleteCategory(category: CategoryModel): void {
    this.af.collection('tax')
      .doc(this.authService.currentUserId)
      .collection('categories').doc(category.id).delete();
  }

  // HELPERS

  private calculateNet(vat: string, amount: number, vatRate: number = this.vatRate): string {
    return (vat === "Incl.") ? (amount/(100 + vatRate)*100).toFixed(2) : amount.toFixed(2);
  }

  private calculateVat(amount: number, autoNet: number) {
    return (amount - autoNet).toFixed(2);
  }
}
