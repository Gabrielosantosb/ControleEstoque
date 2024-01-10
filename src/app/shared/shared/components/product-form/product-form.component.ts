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
import {ProductEvent} from "../../../../modules/products/enums/products/ProductEvent.js";
import {EditProductRequest} from "../../../../../models/interfaces/products/request/EditProductRequest";
import {ToolTipService} from "../../../../services/tool-tip/tool-tip";

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: [],
  providers: [ToolTipService]
})
export class ProductFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  public categoriesDatas: Array<GetCategoriesResponse> = [];
  public selectedCategory: Array<{ name: string; code: string }> = [];
  public productAction!: {
    event: EventAction;
    productDatas: Array<GetAllProductsResponse>;
  };
  public productSelectedDatas!: GetAllProductsResponse;
  public productsDatas: Array<GetAllProductsResponse> = [];
  public addProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    category_id: ['', Validators.required],
    amount: [0, Validators.required],
  });
  public editProductForm = this.formBuilder.group({
    name: ['', Validators.required],
    price: ['', Validators.required],
    description: ['', Validators.required],
    amount: [0, Validators.required],
    category_id: ['', Validators.required],
  });

  public addProductAction = ProductEvent.ADD_PRODUCT_EVENT;
  public editProductAction = ProductEvent.EDIT_PRODUCT_EVENT;
  public saleProductAction = ProductEvent.SALE_PRODUCT_EVENT;
  public renderDropdown = false

  constructor(
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private productsDtService: ProductsDataTransferService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    public ref: DynamicDialogConfig,
    private toolTip: ToolTipService,
  ) {
  }

  ngOnInit(): void {
    this.productAction = this.ref.data;
    this.productAction?.event?.action === this.saleProductAction && this.getProductDatas();
    this.getAllCategories();
    this.renderDropdown = true
  }

  getAllCategories(): void {
    this.categoriesService
      .getAllCategories()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.categoriesDatas = response;
            if (this.productAction?.event?.action === this.editProductAction && this.productAction?.productDatas) {
              this.getProductSelectedDatas(this.productAction?.event?.id as string);
            }
          }
        },
      });
  }

  handleSubmitAddProduct(): void {
    if (this.addProductForm?.value && this.addProductForm?.valid) {
      const requestCreateProduct: CreateProductRequest = {
        name: this.addProductForm.value.name as string,
        price: this.addProductForm.value.price as string,
        description: this.addProductForm.value.description as string,
        category_id: this.addProductForm.value.category_id as string,
        amount: Number(this.addProductForm.value.amount),
      };

      this.productsService
        .createProduct(requestCreateProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            if (response) {
              this.toolTip.SuccessMessage('Produto criado com sucesso!')
            }
          },
          error: (err) => {
            console.log(err);
            this.toolTip.ErrorMessage('Erro ao criar produto!')
          },
        });
    }

    this.addProductForm.reset();
  }

  handleSubmitEditProduct(): void {
    if (
      this.editProductForm.value &&
      this.editProductForm.valid &&
      this.productAction.event.id
    ) {
      const requestEditProduct: EditProductRequest = {
        name: String(this.editProductForm.value.name),
        price: String(this.editProductForm.value.price),
        description: String(this.editProductForm.value.description as string),
        product_id: this.productAction?.event?.id,
        amount: Number(this.editProductForm.value.amount),
        category_id: String(this.editProductForm.value.category_id)
      };

      this.productsService
        .editProduct(requestEditProduct)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.toolTip.SuccessMessage('Produto editado com sucesso!')
            this.editProductForm.reset();
          },
          error: (err) => {
            this.toolTip.ErrorMessage('Erro ao editar produto')
            this.editProductForm.reset();
            console.log(err);
          },
        });
    }
  }

  getProductSelectedDatas(productId: string): void {
    const allProducts = this.productAction?.productDatas;


    if (allProducts.length > 0) {
      const productFiltered = allProducts.filter(
        (element) => element?.id === productId
      );

      if (productFiltered) {
        this.productSelectedDatas = productFiltered[0];

        this.editProductForm.setValue({
          name: this.productSelectedDatas?.name,
          price: this.productSelectedDatas?.price,
          amount: this.productSelectedDatas?.amount,
          description: this.productSelectedDatas?.description,
          category_id: this.productSelectedDatas?.category.id
        });
      }
    }
  }

  getProductDatas(): void {
    this.productsService
      .getAllProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.productsDatas = response;
            this.productsDatas &&
            this.productsDtService.setProductsDatas(this.productsDatas);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
