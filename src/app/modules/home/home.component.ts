import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../../services/user/user.service";
import {AuthRequest} from "../../../models/interfaces/auth/AuthRequest";
import {SignUpUserRequest} from "../../../models/interfaces/user/SignUpUserRequest";
import {Subject, takeUntil, tap} from "rxjs";
import {CookieService} from "ngx-cookie-service";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";
import {environments} from "../../../environments/environments";
import {ToolTipService} from "../../services/tool-tip/tool-tip";



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ToolTipService]
})
export class HomeComponent implements OnDestroy {
  loginCard = true;
  errorMessage = "";
  private destroy$ = new Subject<void>();

  loginForm = this.formBuilder.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", Validators.required]
  });

  signUpForm = this.formBuilder.group({
    name: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(6)]]
  });
  private readonly USER_AUTH = environments.COOKIES_VALUE.user_auth;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private cookieService: CookieService,
              private messageService: MessageService,
              private router: Router,
              private toolTip: ToolTipService) {
  }

  clearErrorMessage(): void {
    this.errorMessage = "";
  }

  onSubmitLogin(): void {
    if (this.loginForm.valid) {
      this.userService.authUser(this.loginForm.value as AuthRequest).pipe(
        takeUntil(this.destroy$),
        tap(
          (response) => {
            if (response) {
              this.cookieService.set(this.USER_AUTH, response?.token)
              this.errorMessage = "";
              this.loginForm.reset();
              this.router.navigate(["/dashboard"])
              this.toolTip.SuccessMessage(`Seja bem vindo ${response.name}`)
            }
          }
        )
      ).subscribe({
        error: (err) => {
          this.toolTip.ErrorMessage('Erro ao efetuar login')
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
        takeUntil(this.destroy$),
        tap(
          (response) => {
            if (response) {
              this.signUpForm.reset();
              this.loginCard = true;
              this.toolTip.SuccessMessage(`Usuário criado com sucesso!`)
            }
          }
        )
      ).subscribe({
        error: (err) => {
          this.toolTip.ErrorMessage(`Erro ao efetuar cadastro`)
          console.log(err);
        }
      });
    } else {
      this.errorMessage = "Por favor, corrija os campos destacados.";
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private openToast(sucess: boolean, title: string, details: string): void {
    if (sucess)
      this.toolTip.SuccessMessage(`Usuário criado com sucesso!`)
  }
}
