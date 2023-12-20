import {Component} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {ConfirmationService, MessageService} from "primeng/api";

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: []
})
export class ToolbarNavigationComponent {

  constructor(private cookie: CookieService, private router: Router, private confirmationService: ConfirmationService) {
  }

  logout(): void {
    this.confirmationService.confirm({
      message: "Tem certeza que deseja sair?",
      accept: () => {
        this.cookie.delete("USER_INFO")
        void this.router.navigate(["/home"])
      }
    })
  }
}
