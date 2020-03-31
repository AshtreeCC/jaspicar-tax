import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  category: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

  createCategory(): void { 
    // this.afo.list(this.data.location).push({"title": this.category});
    // this.category = "";
  }

  updateCategory(index): void {
      // let key = this.data.categories[index].$key;
      // let val = this.data.categories[index].title;
      // this.afo.list(this.data.location).update(key, {"title": val});
  }

}
