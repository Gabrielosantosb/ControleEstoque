import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {DynamicDialogConfig} from "primeng/dynamicdialog";
import {FormBuilder, Validators} from "@angular/forms";
import {MessageService} from "primeng/api";
import {CategoriesService} from "../../../../../services/categories/categories.service";
import {CategoryEvent} from "../../../../../../models/interfaces/enums/categories/CategoryEvent";
import {EditCategoryAction} from "../../../../../../models/interfaces/categories/event/editCategory";
import {ToastMessage} from "../../../../../services/toast-message/toast-message";

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
  providers: [ToastMessage]
})
export class CategoryFormComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject()
  public addCategoryAction = CategoryEvent.ADD_CATEGORY_ACTION
  public editCategoryAction = CategoryEvent.EDIT_CATEGORY_ACTION
  public categoryAction !: { event: EditCategoryAction }
  public categoryForm = this.formBuilder.group({
    name: ['', Validators.required]
  })

  constructor(
    private ref: DynamicDialogConfig,
    private formBuilder: FormBuilder,
    private toastMessage: ToastMessage,
    private categoriesService: CategoriesService
  ) {
  }

  handleSubmitCategory(): void {
    if (this.categoryForm.value && this.categoryForm.valid) {
      const requestCreateCategory: { name: string } = {
        name: String(this.categoryForm.value.name)
      }

      this.categoriesService.createCategory(requestCreateCategory).pipe(takeUntil(this.destroy$)).subscribe({
        next: (response) => {
          this.categoryForm.reset()
          this.toastMessage.SuccessMessage('Categoria editada com sucesso')
        },
        error: (err) => {
          this.categoryForm.reset()
          this.toastMessage.ErrorMessage('Erro ao editar categoria')
          console.log(err);
        }
      })
    }
  }
  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
