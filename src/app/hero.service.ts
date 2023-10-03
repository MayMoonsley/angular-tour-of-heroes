import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { HEROES } from './mock_heroes';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

  private heroesUrl = 'api/heroes'; // is there a reason the tutorial didn't say to make this const?

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }; // it didn't say to make this one private *or* const. what's up with that?

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
        .pipe(
            tap(_ => this.log('fetched heroes')),
            catchError(this.handleError('getHeroes', []))
        );
  }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
        .pipe(
            tap(_ => this.log(`fetched hero id=${id}`)),
            catchError(this.handleError<Hero>(`getHero id=${id}`))
        );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
        .pipe(
            tap((newHero: Hero) => this.log(`added hero with id=${newHero.id}`)),
            catchError(this.handleError<Hero>('addHero'))
        )
  }

  deleteHero(id: number): Observable<any> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete(url, this.httpOptions).pipe(
        tap(_ => this.log(`deleted hero id=${id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions)
        .pipe(
            tap(_ => `updated hero id=${hero.id}`),
            catchError(this.handleError<any>('updateHero'))
        );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
        console.error(error);

        this.log(`${operation} failed: ${error.message}`);

        return of(result as T);
    }
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
