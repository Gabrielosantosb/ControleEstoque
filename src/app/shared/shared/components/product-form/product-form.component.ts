import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, take, takeUntil} from "rxjs";
import {CategoriesService} from "../../../../services/categories/categories.service";
import {FormBuilder, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {GetCategoriesResponse} from "../../../../../models/interfaces/categories/get-categories-service.service";
import {CreateProductRequest} from "../../../../../models/interfaces/products/request/CreateProductRequest";
import {ProductsService} from "../../../../services/products/products.service";
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import {EventAction} from "../../../../../models/interfaces/products/event/EventAction";
import {GetAllProductsResponse} from "../../../../../models/interfaces/products/response/GetAllProductsResponse";
import {elements} from "chart.js";
import {ProductsDataTransferService} from "../../products/products-data-transfer.service";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: []
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject()
  public categoriesDatas: Array<GetCategoriesResponse> = []
  public productSelectedDatas!: GetAllProductsResponse
  public productAction !: {
    event: EventAction;
    productsData: Array<GetAllProductsResponse>;
  }
  public selectedCategory: { name: string, code: string }[] = [];
  public productsData: Array<GetAllProductsResponse> = []
  public addProductForm = this.formBuilder.group({
    name: ["", Validators.required],
    price: ["", Validators.required],
    description: ["", Validators.required],
    category_id: ["", Validators.required],
    amount: [0, Validators.required]
  })

  public editProductForm = this.formBuilder.group({
    name: ["", Validators.required],
    price: ["", Validators.required],
    description: ["", Validators.required],
    amount: [0, Validators.required]
  })

  ngOnInit(): void {
    this.productAction = this.ref.data;
    this.getAllCategories()
  }

  constructor(private categoriesService: CategoriesService,
              private formBuilder: FormBuilder,
              private router: Router,
              private productsDataService: ProductsDataTransferService,
              private messageService: MessageService,
              private productsService: ProductsService,
              public ref: DynamicDialogConfig
  ) {
  }

  private getAllCategories() {
    this.categoriesService.getAllCategories().pipe(takeUntil(this.destroy$)).subscribe({
      next: (response) => {
        if (response.length > 0) this.categoriesDatas = response
      }
    })
  }

  public handleSubmitAddProduct() {
    if (this.addProductForm?.value && this.addProductForm?.valid) {
      const requestCreateProduct: CreateProductRequest =
        {
          name: this.addProductForm.value.name as string,
          price: this.addProductForm.value.price as string,
          description: this.addProductForm.value.description as string,
          category_id: this.addProductForm.value.category_id as string,
          amount: Number(this.addProductForm.value.amount),
        }
      this.productsService.createProduct(requestCreateProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto Criado!',
              life: 2000
            });
          },
          error: (err) => {
            console.log(err)
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao criar produto ',
              life: 2000
            });
          }
        });
      this.addProductForm.reset()
    }
  }

  public handletEditProduct() {
    // if(this.editProcutsForm.value && this.editProcutsForm.valid){}
  }

  public getProductSelectedDatas(product_id: string) {
    const allProducts = this.productAction?.productsData;
    if (allProducts?.length > 0) {
      const productFiltered = allProducts?.filter(
        (element) => element?.id === product_id)
      if (productFiltered) {
        this.productSelectedDatas = productFiltered[0];

        this.editProductForm.setValue({
          name: this.productSelectedDatas?.name,
          price: this.productSelectedDatas?.price,
          description: this.productSelectedDatas?.description,
          amount: this.productSelectedDatas?.amount,
        })
      }
    }
  }

  getProductsDatas() {
    this.productsService.getAllProducts().pipe(takeUntil(this.destroy$)).subscribe(
      {
        next:(response) =>{
          if(response.length > 0){
            this.productsData = response
            this.productsData && this.productsDataService.setProductsDatas(this.productsData)
          }
        }
      }
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
