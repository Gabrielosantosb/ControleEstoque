import {Component, Input} from '@angular/core';
import {GetCategoriesResponse} from "../../../../../models/interfaces/categories/get-categories-service.service";

@Component({
  selector: 'app-categories-table',
  templateUrl: './categories-table.component.html',
  styleUrls: ['./categories-table.component.scss']
})
export class CategoriesTableComponent {
  @Input() public categories : Array<GetCategoriesResponse> = []
  public categorySelected!: GetCategoriesResponse
}
