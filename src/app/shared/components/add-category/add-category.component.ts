import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '@shared/services/data.service';
import { Observable } from 'rxjs';
import { CategoryModel } from '@shared/models/category.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCategoryComponent implements OnInit {

  categories$: Observable<CategoryModel[]>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.categories$ = this.dataService.getCategories(this.data.formType);
  }

  createCategory(field: any): void { 
    this.dataService.addCategory(field.value, this.data.formType);
    field.value = '';
  }

  updateCategory(field: any, category: CategoryModel): void {
      if (field.value === '') {
        this.dataService.deleteCategory(category);
        return;
      }
      category.name = field.value;
      this.dataService.setCategory(category);
  }

}
