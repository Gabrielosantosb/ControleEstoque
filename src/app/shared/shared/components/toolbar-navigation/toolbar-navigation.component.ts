import { Component } from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-toolbar-navigation',
  templateUrl: './toolbar-navigation.component.html',
  styleUrls: []
})
export class ToolbarNavigationComponent {
  constructor(private cookie: CookieService, private router: Router, private messageService: MessageService) {}

  logout():void{
    this.cookie.delete("USER_INFO")
    void this.router.navigate(["/home"])
    this.messageService.add({
      severity: "success",
      summary: "Logout bem-sucedido",
      detail: "Você foi desconectado com sucesso do sistema.",
      life: 2000
    })
  }
}
