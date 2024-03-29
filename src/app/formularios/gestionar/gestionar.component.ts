import { Component } from '@angular/core';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FacturaModel } from '../../models/factura.model';
import { FormsService } from '../../services/forms.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestionar',
  templateUrl: './gestionar.component.html',
  styleUrl: './gestionar.component.css',
})
export class GestionarComponent {
  faPenToSquare = faPenToSquare;
  faTrash = faTrash;

  mensajeError={
    estado:false,
    mensaje:''
  }
  sinDetalle = false;

  factura:FacturaModel= new FacturaModel();

  constructor(private frm:FormsService, private route:Router){}

  ngOnInit() {
    this.consultarFactura();

  }

  consultarFactura(){
    this.frm.consultar(3, '001').subscribe(
      (resp: any) => {
        this.factura = resp;
        this.mensajeError.estado=false; 
        this.sinDetalle = this.factura.detalles?.length! <= 0
        
                    
      },
      (err) => {
        this.mensajeError.estado=true
        this.mensajeError.mensaje = err.error.text
        console.log(err);
      }
    );
  }

  actualizar(boton: number, estado: number) {
    Swal.fire({
      icon:'info',
      allowOutsideClick: false,      
      text: 'Espere por favor...',
    });
    Swal.showLoading();

    this.frm.actualizar(estado, boton, this.factura).subscribe(
      (resp: any) => {
        Swal.close();
        Swal.fire({
          //title: "Actualización",
          text: "La factura se actualizó correctamente, ¿desea cargar una nueva factura?",
          icon: "info",
          showCancelButton: true,
          allowOutsideClick: false,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Cargar factura",
          cancelButtonText:"Cancelar"
        }).then((result) => {
          if (result.isConfirmed) {
            this.consultarFactura();
          }
          if (result.isDismissed) {
            this.route.navigate(['/dashboard/home']); 
          }
          
        });
      },
      (err) => {
        Swal.close();
        console.log({ err });
      }
    );
  }

}
