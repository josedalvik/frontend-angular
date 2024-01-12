import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Mensaje } from '../api/model/mensaje';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent implements OnInit {
  
  recuperando = 0;
  mensaje: any;
  
  enviado = false;
  validando = false;
  error = "";
  Form: FormGroup;
  id: any;
  editado = false;
  
  get f() { return this.Form.controls; }
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private modeloMensaje: Mensaje,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    
    this.error = '';
    //formulario
    this.Form = this.formBuilder.group({
      asunto: ['', [Validators.required]],
      mensaje: ['', [Validators.required]],
    });
    
    this.recuperando = 1;
    this.modeloMensaje.obtener(this.id).subscribe((data:any)=>{
      this.validando = false;
      if(data['resultado']=="not ok"){
        this.recuperando = 2;
      }else if(data['resultado']=="ok"){
        this.recuperando = 0;
        let mensaje = data['mensaje'];
        
        this.Form = this.formBuilder.group({
          asunto: [mensaje.asunto, [Validators.required]],
          mensaje: [mensaje.mensaje, [Validators.required]],
        });
        
      }else{
        this.recuperando = 2;
      }
    }); 
  }
  
  regresar(){
    this.router.navigate(['/']);
  }
  
  onsubmit() {
    
    this.enviado = true;
    this.editado = false;
    if (this.Form.invalid) {
      this.error = "Por favor completa el formulario";
      return;
    }
    
    this.validando = true;
    this.enviado = false;
    
    this.modeloMensaje.editar(this.Form.value, this.id).subscribe((data:any)=>{
      this.validando = false;
      if(data['resultado']=="not ok"){
        this.error = "Por favor completa el formulario.";
      }else if(data['resultado']=="ok"){
        this.error = "";
        this.editado = true;
        setTimeout(() => {
          this.editado = false;
        }, 3000);
      }else{
        this.error = "Error en la solicitud.";
      }
    });
    
  }

}
