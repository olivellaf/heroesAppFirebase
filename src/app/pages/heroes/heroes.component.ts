import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { HeroeModel } from '../../models/heroe.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: HeroeModel[] = [];
  loading = false;

  constructor( private hs: HeroesService) { }

  ngOnInit() {

    this.loading = true;
    this.hs.getHeroes()
      .subscribe( resp => {
        this.heroes = resp;
        this.loading = false;
      }); // versió resumida

  }

  deleteHeroe( heroe: HeroeModel, i: number ) {

    Swal.fire({
      title: 'Are you sure?',
      text: `Want to delete ${ heroe. name } `,
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if (resp.value ) {
        // lo ideal seria esborrar també de l'array, dins del subscribe
        this.heroes.splice(i, 1);
        this.hs.removeHeroeByID( heroe.id ).subscribe();
      }
    })
  }

}
