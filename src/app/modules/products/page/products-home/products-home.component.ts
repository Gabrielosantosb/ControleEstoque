import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {ProductsService} from "../../../../services/products/products.service";
import {ProductsDataTransferService} from "../../../../shared/shared/products/products-data-transfer.service";
import {Router} from "@angular/router";
import {GetAllProductsResponse} from "../../../../../models/interfaces/products/response/GetAllProductsResponse";
import {ConfirmationService, MessageService} from "primeng/api";
import {EventAction} from "../../../../../models/interfaces/products/event/EventAction";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ProductFormComponent} from "../../../../shared/shared/components/product-form/product-form.component";

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: []
})
export class ProductsHomeComponent implements OnDestroy, OnInit {
  public productsData: Array<GetAllProductsResponse> = []
  private ref!: DynamicDialogRef;
  private readonly destroy$: Subject<void> = new Subject()


  constructor(private productsService: ProductsService,
              private productsDataService: ProductsDataTransferService,
              private router: Router,
              private messageService: MessageService,
              private confirmationService: ConfirmationService,
              private dialogService: DialogService) {
  }

  ngOnInit(): void {
    this.getProductData()
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

  handleProductAction(event: EventAction): void {
    if (event) {
      this.ref = this.dialogService.open(ProductFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle:{overflow:'auto'},
        maximizable: true,
        data:{
          event: event,
          productsDatas: this.productsData
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next:() =>{
          this.getAPIProductData()
        }
      })
    }


  }

  handleDeleteAction(event: { product_id: string, productName: string }): void {
    if (event) {
      this.confirmationService.confirm({
        message: `Tem certeza que deseja excluir o produto: ${event?.productName}?`,
        header: "Excluir produto",
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "Sim",
        rejectLabel: "Não",
        accept: () => {
          this.deleteProduct(event?.product_id)
        }
      })
    }
  }

  private deleteProduct(product_id: string): void {
    this.productsService.deleteProduct(product_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response) {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto Removido!',
              life: 2000
            });
            this.getAPIProductData();
          }
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao deletar produto',
            life: 2000
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }
}
