import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { Hero } from './hero';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable()
export class HeroService {
	constructor(
		private http: HttpClient,
		private messageService: MessageService) { }

	private log(message: string) {
		this.messageService.add('HeroService: ' + message);
	}

	private heroesUrl = 'api/heroes';

	getHeroes() : Observable<Hero[]> {
		return this.http.get<Hero[]>(this.heroesUrl)
		.pipe(
			tap(heroes => this.log('fetched heroes')),
			catchError(this.handleError('getHeroes', []))
			);
	}

	getHero(id: number) : Observable<Hero> {
		const url = `${this.heroesUrl}/${id}`;
		return this.http.get<Hero>(url).pipe(
			tap(_ => this.log(`fetched hero id=${id}`)),
			catchError(this.handleError<Hero>(`getHero id=${id}`))
			)
	}

	updateHero(hero: Hero) : Observable<any> {

		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};

		return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
			tap(_ => this.log(`updated hero id ${hero.id}`)),
			catchError(this.handleError<any>('updateHero'))
			)
	}

	addHero(hero: Hero) : Observable<Hero> {

		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		};

		return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
			tap((hero: Hero) => this.log(`added hero id ${hero.id}`)),
			catchError(this.handleError<Hero>('addHero'))	
			);
	}

	deleteHero(id: string) : Observable<any> {

		const httpOptions = {
			headers: new HttpHeaders({ 'Content-Type': 'application/json' })
		}

		const url = `${this.heroesUrl}/${id}`;

		return this.http.delete(url, httpOptions).pipe(
			tap(_ => this.log(`deleted hero id ${id}`)),
			catchError(this.handleError<Hero>('deleteHero'))		
		)
	}
	/**
	 * Handle Http operation that failed.
	 * Let the app continue.
	 * @param operation - name of the operation that failed
	 * @param result - optional value to return as the observable result
	 */
	 private handleError<T> (operation = 'operation', result?: T) {
	 	return (error: any): Observable<T> => {

	 		// TODO: send the error to remote logging infrastructure
	 		console.error(error); // log to console instead

	 		// TODO: better job of transforming error for user consumption
	 		this.log(`${operation} failed: ${error.message}`);

	 		// Let the app keep running by returning an empty result.
	 		return of(result as T);
	 	};
	 }
	}
