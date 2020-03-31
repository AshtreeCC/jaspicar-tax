import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import 'firebase/firestore';
import { IncomeModel, IncomeForm } from '@shared/models/income.model';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private af: AngularFirestore,
    private authService: AuthService,
  ) { }

  setIncome(income: IncomeModel) {
    console.log(new IncomeForm(income));
  }

  getIncome(date: Date): Observable<any> {
    return this.af.collection('tax')
      .doc(this.authService.currentUserId)
      .collection('income', ref => ref).valueChanges();
  }
}
