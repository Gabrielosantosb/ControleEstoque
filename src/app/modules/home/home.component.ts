import { Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { UserService } from "../../services/user/user.service";
import { AuthRequest } from "../../../models/interfaces/auth/AuthRequest";
import { SignUpUserRequest } from "../../../models/interfaces/user/SignUpUserRequest";
import { tap } from "rxjs";
import {CookieService} from "ngx-cookie-service";
import {MessageService} from "primeng/api";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loginCard = true;
  errorMessage = "";

  loginForm = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required]
  });

  signUpForm = this.formBuilder.group({
    name: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]]
  });

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private cookieService: CookieService,
              private messageService: MessageService) {}

  clearErrorMessage(): void {
    this.errorMessage = "";
  }

  onSubmitLogin(): void {
    if (this.loginForm.valid) {
      this.userService.authUser(this.loginForm.value as AuthRequest).pipe(
        tap(
          (response) => {
            if (response) {
              this.cookieService.set("USER_INFO", response?.token)
              this.errorMessage = "";
              this.loginForm.reset();
              this.messageService.add({
                severity: "success",
                summary: "Tudo certo!",
                detail: `Seja bem vindo ${response.name}`,
                life: 2000
              })
            }
          }
        )
      ).subscribe({
        error: (err) => {
          this.messageService.add({
            severity: "error",
            summary: "Erro",
            detail: `Erro ao efetuar login`,
            life: 2000
          })
          console.log(err);
        }
      });
    } else {
      this.errorMessage = "Por favor, corrija os campos destacados.";
    }
  }

  onSubmitSignUp(): void {
    if (this.signUpForm.valid) {
      this.userService.signupUser(this.signUpForm.value as SignUpUserRequest).pipe(
        tap(
          (response) => {
            if (response) {
              this.signUpForm.reset();
              this.loginCard = true;
              this.messageService.add({
                severity: "success",
                summary: "Tudo certo!",
                detail: `Usuário criado com sucesso!`,
                life: 2000
              })
            }
          }
        )
      ).subscribe({
        error: (err) => {
          this.messageService.add({
            severity: "error",
            summary: "Erro",
            detail: `Erro ao efetuar o cadastro`,
            life: 2000
          })
          console.log(err);
        }
      });
    } else {
      this.errorMessage = "Por favor, corrija os campos destacados.";
    }
  }
}
