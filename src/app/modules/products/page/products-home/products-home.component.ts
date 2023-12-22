import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {ProductsService} from "../../../../../models/interfaces/products/products.service";
import {ProductsDataTransferService} from "../../../../shared/shared/products/products-data-transfer.service";
import {Router} from "@angular/router";
import {GetAllProductsResponse} from "../../../../../models/interfaces/products/response/GetAllProductsResponse";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductsHomeComponent implements OnDestroy, OnInit {
  public productsData: Array<GetAllProductsResponse> = []
  private readonly destroy$: Subject<void> = new Subject()

  constructor(private productsService: ProductsService,
              private productsDataService: ProductsDataTransferService,
              private router: Router,
              private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.getProductData()
  }


  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private getProductData() {
    const productsLoaded = this.productsDataService.getProductsData();
    if (productsLoaded.length > 0) this.productsData = productsLoaded;
    this.getAPIProductData()

  }

  private getAPIProductData() {
    this.productsService.getAllProducts().pipe(takeUntil(this.destroy$)).subscribe({
      next: ((response) => {
        if (response.length > 0) this.productsData = response
      }),
      error: ((err) => {
        console.log(err)
        this.messageService.add({
          severity: "error",
          summary: "Erro",
          detail: "Erro ao buscar produtos",
          life: 2000
        })
        this.router.navigate(['/dashboard'])
      })
    })
  }
}
