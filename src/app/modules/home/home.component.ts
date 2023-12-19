import { Component } from '@angular/core';
import { FormBuilder, Validators } from "@angular/forms";
import { UserService } from "../../services/user/user.service";
import { AuthRequest } from "../../../models/interfaces/auth/AuthRequest";
import { SignUpUserRequest } from "../../../models/interfaces/user/SignUpUserRequest";
import { tap } from "rxjs";

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

  constructor(private formBuilder: FormBuilder, private userService: UserService) {}

  clearErrorMessage(): void {
    this.errorMessage = "";
  }
  onSubmitLogin(): void {

    if (this.loginForm.valid) {
      this.userService.authUser(this.loginForm.value as AuthRequest).pipe(
        tap(
          (response) => {
            if (response) {
              this.errorMessage = "";
              alert("Usuário logado");
            }
          }
        )
      ).subscribe({
        error: (err) => {
          this.errorMessage = "Usuário Inválido";
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
              alert("Usuário criado com sucesso");
            }
          }
        )
      ).subscribe({
        error: (err) => {
          console.log(err);
        }
      });
    } else {
      this.errorMessage = "Por favor, corrija os campos destacados.";
    }
  }
}
