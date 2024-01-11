import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoriesService} from "../../../../services/categories/categories.service";
import {Dialog} from "primeng/dialog";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {ConfirmationService, MessageService} from "primeng/api";
import {Subject, takeUntil} from "rxjs";
import {GetCategoriesResponse} from "../../../../../models/interfaces/categories/get-categories-service.service";
import {ToastMessage} from "../../../../services/toast-message/toast-message";
import {Router} from "@angular/router";
import {ConfirmationModal} from "../../../../services/confirmatio/confirmation-service.service";
import {DeleteCategory} from "../../../../../models/interfaces/categories/event/deleteCategory";
import {EventAction} from "../../../../../models/interfaces/products/event/EventAction";
import {CategoryFormComponent} from "../../components/category-form/category-form/category-form.component";
import {error} from "@angular/compiler-cli/src/transformers/util";

@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
  styleUrls: ['./categories-home.component.scss'],
  providers: [ToastMessage, ConfirmationModal]
})
export class CategoriesHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject()
  public categoriesData: Array<GetCategoriesResponse> = []
  private ref !: DynamicDialogRef

  ngOnInit() {
    this.getAllCategories();
  }

  constructor(private router: Router,
              private categoriesService: CategoriesService,
              private dialogService: DialogService,
              private toastMessage: ToastMessage,
              private confirmationService: ConfirmationService,
              private confirmationModal: ConfirmationModal) {
  }

  getAllCategories(): void {
    this.categoriesService.getAllCategories().pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          if (response.length > 0) this.categoriesData = response
        },
        error: (err) => {
          console.log(err)
          this.toastMessage.ErrorMessage('Erro ao buscar categorias')
          this.router.navigate(['/dashboard'])
        }
      }
    )
  }

  handleDeleteCategory(event: DeleteCategory): void {
    if (event) {
      this.confirmationModal.confirmDelete(`Certeza que deseja deletar a categoria ${event.categoryName}?`,
        () => this.deleteCategory(event.category_id))
    }
  }

  deleteCategory(category_id: string): void {
    console.log('aqui', category_id)
    if (category_id) {
      this.categoriesService.deleteCategory({category_id}).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          this.toastMessage.SuccessMessage('Categoria Removida!')
          this.getAllCategories();
        },
        error: (err) => {
          this.toastMessage.ErrorMessage('Erro ao remover categoria')
          this.getAllCategories();
        }
      });
    }
  }

  handleCategoryAction(event: EventAction): void {
    if (event) this.ref = this.dialogService.open(CategoryFormComponent, {
      header: event.action,
      width: '70%',
      contentStyle: {overflow: 'auto'},
      baseZIndex: 10000,
      data: {
        event: event
      }
    }),
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getAllCategories()
      })
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }
}

