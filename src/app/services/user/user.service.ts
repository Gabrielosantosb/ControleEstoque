import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environments} from "../../../environments/environments";
import {SignUpUserRequest} from "../../../models/interfaces/user/SignUpUserRequest";
import {Observable} from "rxjs";
import {SignUpUserResponse} from "../../../models/interfaces/user/SignUpUserResponse";
import {AuthRequest} from "../../../models/interfaces/auth/AuthRequest";
import {AuthResponse} from "../../../models/interfaces/auth/AuthResponse";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL = environments.API_URL
  constructor(private http: HttpClient) { }

  signupUser (requestData: SignUpUserRequest): Observable<SignUpUserResponse>
  {
    return this.http.post<SignUpUserResponse>(
      `${this.API_URL}/user`,
      requestData
    )
  }

  authUser(requestData: AuthRequest): Observable<AuthResponse>{
    return this.http.post<AuthResponse>(
      `${this.API_URL}/auth`,
      requestData
    )
  }
}
