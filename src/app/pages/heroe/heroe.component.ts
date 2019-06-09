import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { HeroeModel } from '../../models/heroe.model';
import { NgForm } from '@angular/forms';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
  styleUrls: ['./heroe.component.css']
})
export class HeroeComponent implements OnInit {

  heroe: HeroeModel = new HeroeModel();

  constructor( private heroesService: HeroesService,
               private route: ActivatedRoute ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id'); // obtenim el ID de la ruta
    //console.log(id);
    if( id != 'new') {
      this.heroesService.getHeroeByID( id )
        .subscribe( (resp: HeroeModel) => {
          this.heroe = resp;
          this.heroe.id = id;
        });
    }
  }


  save( form: NgForm ) {

    if( form.invalid) {
      console.log("Invalid form");
      return;
    }

    Swal.fire({
      title: 'Wait',
      text: 'Saving information',
      type: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    let request: Observable<any>

    if( this.heroe.id ) {
      request = this.heroesService.updateHeroe(this.heroe);
    } else {
      request = this.heroesService.createHeroe(this.heroe);
    }

    request.subscribe( resp => {

      Swal.fire({
        title: this.heroe.name,
        text: 'Heroe updated properly',
        type: 'success'
      });

    })


  }

}
