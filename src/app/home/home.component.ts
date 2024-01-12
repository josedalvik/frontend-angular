import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Mensaje } from '../api/model/mensaje';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  enviado = false;
  validando = false;
  error = "";
  Form: FormGroup;
  guardado = false;
  eliminando = 0;
  
  mensajes = [];
  error_mensajes = "";
  
  constructor(
    private formBuilder: FormBuilder,
    private modeloMensaje: Mensaje,
  ) { }
  
  get f() { return this.Form.controls; }
  
  ngOnInit(): void {
    this.error = '';
    //formulario
    this.Form = this.formBuilder.group({
      asunto: ['', [Validators.required]],
      mensaje: ['', [Validators.required]],
    });

    this.recuperar();
  }
  
  recuperar(){

    this.modeloMensaje.recuperar().subscribe((data:any)=>{
      this.validando = false;
      if(data['resultado']=="not ok"){
        this.error_mensajes = "Error de recuperación de datos.";
      }else if(data['resultado']=="ok"){
        this.error_mensajes = "";
        this.mensajes = data["mensajes"];
      }else{
        this.error_mensajes = "Error de recuperación de datos.";
      }
    }); 
  }
  
  eliminar(id:any){
    this.eliminando = 1;
    this.modeloMensaje.eliminar(id).subscribe((data:any)=>{
      if(data['resultado']=="not ok"){
        this.eliminando = 2;
      }else if(data['resultado']=="ok"){
        this.eliminando = 3;
        this.recuperar();
        setTimeout(() => {
          this.eliminando = 0;
        }, 3000);
      }else{
        this.eliminando = 2;
      }
    }); 
  }
  
  onsubmit() {
    
    this.enviado = true;
    this.guardado = false;
    if (this.Form.invalid) {
      this.error = "Por favor completa el formulario";
      return;
    }
    
    this.validando = true;
    this.enviado = false;
    
    this.modeloMensaje.enviar(this.Form.value).subscribe((data:any)=>{
      this.validando = false;
      if(data['resultado']=="not ok"){
        this.error = "Por favor completa el formulario.";
      }else if(data['resultado']=="ok"){
        this.error = "";
        this.guardado = true;
        this.Form.reset();
        this.recuperar();
        setTimeout(() => {
          this.guardado = false;
        }, 3000);
      }else{
        this.error = "Error en la solicitud.";
      }
    });
    
    
  }

}
