import {Component} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";
import {ConfirmationModal} from "../../../services/confirmatio/confirmation-service.service";


@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: [],
  providers:[ConfirmationModal]
})
export class ToolbarNavigationComponent {

  constructor(private confirmationModal: ConfirmationModal) {}

  logout(): void {
    this.confirmationModal.confirmLogout("Tem certeza que deseja sair?")
  }
}
