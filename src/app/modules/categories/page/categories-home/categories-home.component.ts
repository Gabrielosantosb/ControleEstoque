import {Component, OnDestroy, OnInit} from '@angular/core';
import {CategoriesService} from "../../../../services/categories/categories.service";
import {Dialog} from "primeng/dialog";
import {DialogService} from "primeng/dynamicdialog";
import {ConfirmationService, MessageService} from "primeng/api";
import {Subject, takeUntil} from "rxjs";
import {GetCategoriesResponse} from "../../../../../models/interfaces/categories/get-categories-service.service";
import {ToastMessage} from "../../../../services/toast-message/toast-message";
import {Router} from "@angular/router";

@Component({
  selector: 'app-categories-home',
  templateUrl: './categories-home.component.html',
  styleUrls: ['./categories-home.component.scss'],
  providers:[ToastMessage]
})
export class CategoriesHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject()
  public categoriesData: Array<GetCategoriesResponse> = []

  ngOnInit() {
    this.getAllCategories();
  }

  constructor(private router: Router, private categoriesService: CategoriesService, private dialogService: DialogService, private toastMessage: ToastMessage, private confirmationService: ConfirmationService) {
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

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }
}

