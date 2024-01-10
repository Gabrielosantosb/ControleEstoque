import {Component} from '@angular/core';

import {MessageService} from "primeng/api";

@Component({
  selector: 'app-tool-tip',
  templateUrl: './tool-tip.component.html',
  styleUrls: ['./tool-tip.component.scss']
})
export class ToolTipComponent {
  constructor(private messageService: MessageService) {
  }

  SuccessMessage(detail: string): void {
    this.messageService.add({
      severity: "success",
      summary: "Sucesso",
      detail: detail,
      life: 2000
    })
  }

  ErrorMessage(detail: string): void {
    this.messageService.add({
      severity: "error",
      summary: "Erro",
      detail: detail,
      life: 2000
    })
  }
}
