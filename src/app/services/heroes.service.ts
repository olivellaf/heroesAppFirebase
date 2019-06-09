import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HeroeModel } from '../models/heroe.model';
import { map, delay } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private url = 'https://heroesapp-175b6.firebaseio.com';

  constructor( private http: HttpClient ) {   }

  createHeroe( heroe: HeroeModel ) {
    return this.http.post(`${ this.url }/heroes.json`, heroe)
      .pipe(
        map( (resp:any)=> {
          heroe.id = resp.name
          return heroe;
        })
      );
  }

  updateHeroe( heroe: HeroeModel ) {
    // dupliquem l'objecte, i en creem un de temporal.
    const heroeTemp = {
      ...heroe
    }
    delete heroeTemp.id;  // ara si podem esborrar el ID, per tal de no enviar-lo a Firebase

    return this.http.put(`${this.url}/heroes/${heroe.id}.json`, heroeTemp);
  }

  getHeroeByID( id: string ) {
    return this.http.get(` ${ this.url }/heroes/${ id }.json`);
  }

  removeHeroeByID( id: string ) {
    return this.http.delete(` ${ this.url }/heroes/${ id }.json`);
  }

  getHeroes() {
    return this.http.get(` ${this.url }/heroes.json`)
      .pipe(
        map( this.createHeroesArray ),
        // map( resp => this.createHeroesArray(resp) ) --> fa exactament el mateix que lo de sobre
        delay(1500) // afegit perquè es noti que hem afegit el "loading"
      );
  }

  private createHeroesArray( heroesObj: object ) {
    const heroes: HeroeModel[] = [];

    if( heroesObj === null ) {
      return [];
    }

    // El llistat que arriba de Firebase no està net. S'ha de fer això per tal de passar-ho a un array de JS
    Object.keys( heroesObj ).forEach( key => {
      const heroe: HeroeModel = heroesObj[key];
      heroe.id = key;

      heroes.push(heroe);
    });

    return heroes;
  }
}
