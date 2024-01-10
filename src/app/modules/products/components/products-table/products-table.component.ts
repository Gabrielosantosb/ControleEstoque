import {Component, EventEmitter, Input, Output} from '@angular/core';
import {GetAllProductsResponse} from "../../../../../models/interfaces/products/response/GetAllProductsResponse";
import {ProductEvent} from "../../../../../models/interfaces/enums/products/ProductEvent.js";
import {EventAction} from "../../../../../models/interfaces/products/event/EventAction";
import {DeleteProductAction} from "../../../../../models/interfaces/products/event/DeleteProductAction";

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: []
})
export class ProductsTableComponent {
  @Input() products: Array<GetAllProductsResponse> = []
  @Output() productEvent = new EventEmitter<EventAction>()
  @Output() deleteProductEvent = new EventEmitter<DeleteProductAction>()
  public productsSelected!: GetAllProductsResponse;
  public addProductAction = ProductEvent.ADD_PRODUCT_EVENT
  public editProductAction = ProductEvent.EDIT_PRODUCT_EVENT

  handleProcuctEvent(action: string, id?: string): void {
    if (action && action !== '')
    {
      const productEventData = id && id !== '' ? {action, id} : {action}
      this.productEvent.emit(productEventData)
    }
  }
  handleDeleteProduct(product_id: string, productName: string): void {
    if(product_id !== "" && productName !== "")
    {
      this.deleteProductEvent.emit({
        product_id,
        productName,
      })
    }
  }

}
