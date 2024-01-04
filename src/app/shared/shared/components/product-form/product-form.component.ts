import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {CategoriesService} from "../../../../services/categories/categories.service";
import {FormBuilder, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {GetCategoriesResponse} from "../../../../../models/interfaces/categories/get-categories-service.service";
import {CreateProductRequest} from "../../../../../models/interfaces/products/request/CreateProductRequest";
import {ProductsService} from "../../../../services/products/products.service";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: []
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject()
  public categoriesDatas: Array<GetCategoriesResponse> = []
  public selectedCategory: { name: string, code: string }[] = [];
  public addProductForm = this.formBuilder.group({
    name: ["", Validators.required],
    price: ["", Validators.required],
    description: ["", Validators.required],
    category_id: ["", Validators.required],
    amount: [0, Validators.required]
  })

  ngOnInit(): void {
    this.getAllCategories()
  }

  constructor(private categoriesService: CategoriesService,
              private formBuilder: FormBuilder,
              private router: Router,
              private messageService: MessageService,
              private productsService: ProductsService
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

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
