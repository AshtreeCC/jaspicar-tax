import { Injectable } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { AngularFirestore, DocumentData } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import 'firebase/firestore';
import { IncomeModel, IncomeForm } from '@shared/models/income.model';
import { map, tap } from 'rxjs/operators';
import { CategoryModel } from '@shared/models/category.model';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private af: AngularFirestore,
    private authService: AuthService,
  ) { }

  addIncome(income: IncomeModel) {
    let form: IncomeModel = new IncomeForm(income);
    this.af.collection('tax')
      .doc(this.authService.currentUserId)
      .collection('income').add({
        invoice: form.invoice,
        date: form.date,
        categoryID: form.categoryID,
        description: form.description,
        vat: form.vat,
        amount: form.amount,
        autoNet: form.autoNet,
        autoVat: form.autoVat,
      } as IncomeModel);
  }

  getIncome(date: Date): Observable<any> {
    const income$ = this.af.collection('tax')
      .doc(this.authService.currentUserId)
      .collection('income', ref => ref).valueChanges();

    const categories$ = this.getCategories('income');

    return combineLatest<DocumentData[], DocumentData[]>(income$, categories$).pipe(
      map((data: any) => {
        let [allIncome, categories] = data;
        return allIncome.map(income => {
          return {
            category: categories.find(category => category.id == income.categoryID).name,
            ...income,
          }
        });
      }),
    );
  }

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

  addCategory(name: string, form: string): void {
    this.af.collection('tax')
      .doc(this.authService.currentUserId)
      .collection('categories').add({ name, form });
  }

  setCategory(category: CategoryModel): void {
    this.af.collection('tax')
      .doc(this.authService.currentUserId)
      .collection('categories').doc(category.id).set({
        name: category.name,
        form: category.form,
      });
  }
}
