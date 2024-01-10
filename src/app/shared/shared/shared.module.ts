import { NgModule } from '@angular/core';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {ToolbarModule} from "primeng/toolbar";
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {DialogService} from "primeng/dynamicdialog";
import { ToolbarNavigationComponent } from './components/toolbar-navigation/toolbar-navigation.component';
import {ConfirmDialogModule} from "primeng/confirmdialog";
import { ProductFormComponent } from './components/product-form/product-form.component';
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";
import {InputTextareaModule} from "primeng/inputtextarea";
import {ToolTipService} from "../../services/tool-tip/tool-tip";






@NgModule({
  declarations: [
    ToolbarNavigationComponent,
    ProductFormComponent,

  ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        // PrimeNg
        ToolbarModule,
        CardModule,
        ButtonModule,
        ConfirmDialogModule,
        InputTextModule,
        DropdownModule,
        InputTextareaModule
    ],
  exports: [
    ToolbarNavigationComponent
  ],
  // exports:[ToolbarNavigationComponent],
  providers: [DialogService, CurrencyPipe,ToolTipService]
})
export class SharedModule { }
