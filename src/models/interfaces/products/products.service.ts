import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {environments} from "../../../environments/environments";
import {map, Observable} from "rxjs";
import {GetAllProductsResponse} from "./response/GetAllProductsResponse";

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private API_URL = environments.API_URL
  private token = this.cookie.get("USER_INFO")
  private httpOptions = {
    headers : new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`
    })
  }
  constructor(private http: HttpClient, private cookie: CookieService  ){ }


  getAllProducts():Observable<Array<GetAllProductsResponse>>{
    return this.http.get<Array<GetAllProductsResponse>>(`${this.API_URL}/products`, this.httpOptions).pipe(
      map((product) => product.filter
      ((data) => data?.amount > 0))
    )
  }

}
