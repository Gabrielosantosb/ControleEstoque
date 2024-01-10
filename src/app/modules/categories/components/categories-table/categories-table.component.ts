import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GetCategoriesResponse} from "../../../../../models/interfaces/categories/get-categories-service.service";
import {EditCategoryAction} from "../../../../../models/interfaces/categories/event/editCategory";

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: ['./categories-table.component.scss']
})
export class CategoriesTableComponent {
  @Input() public categories : Array<GetCategoriesResponse> = []
  @Output() public categoryEvent = new EventEmitter<EditCategoryAction>()
  public categorySelected!: GetCategoriesResponse
}
