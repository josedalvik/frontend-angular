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
    }); this.error_mensajes = "Error de recuperación de datos.";
  }
  
  eliminar(id:any){
     
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
      }else{
        this.error = "Error en la solicitud.";
      }
    });
    
    
  }

}
