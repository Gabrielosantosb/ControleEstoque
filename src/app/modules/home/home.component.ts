import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  loginCard = true;

  signUpForm = this.formBuilder.group({
    name: ["", Validators.required],
    email: ["", Validators.required],
    password: ["", Validators.required]
  })
  loginForm = this.formBuilder.group({
    email: ["", Validators.required],
    password: ["", Validators.required]
  })
  constructor(private formBuilder: FormBuilder){}

  onSubmitLogin(): void{
    console.log("Dados:", this.loginForm.value)
  }

  onSubmitSignUp(): void{
    console.log("Dados:", this.signUpForm.value)
  }
}
