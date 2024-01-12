import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as Constants from '../config/constants';

@Injectable({
  providedIn: 'root'
})
export class Mensaje {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };
  
  constructor(private httpClient: HttpClient) {
  }

  public enviar(mensaje:any){
    return this.call(mensaje, "enviar");
  }

  public recuperar(){
    return this.httpClient.get(Constants.apiserver+"recuperar");
  }
  
  public editar(mensaje:any){
    return this.call(mensaje, "editar");
  }
  
  public eliminar(id:any){
    return this.httpClient.get(Constants.apiserver+"eliminar/"+id);
  }

  private call(data:any, metodo:any){
    return this.httpClient.post(
      Constants.apiserver+metodo, 
      data, 
      this.httpOptions
    );
  }

}