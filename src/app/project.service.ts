import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Project } from './Project';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor( private http: HttpClient, private messageService: MessageService) { }
  private projectsUrl = 'api/projects';  // URL to web api

httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

  getProjects(): Observable <Project[]> {
     // TODO: send the message _after_ fetching the projects
    this.messageService.add('ProjectService: fetched projects');

    return this.http.get<Project[]>(this.projectsUrl)
    .pipe(
      tap(_ => this.log('fetched projects')),
      catchError(this.handleError<Project[]>({ operation: 'getProjects', result: [] }))
  );
  }

  /* GET project by id. Will 404 if id not found */
  getProject(id: number): Observable<Project> {
      const url = `${this.projectsUrl}/${id}`;
      return this.http.get<Project>(url).pipe(
      tap(_ => this.log (`fetched project id=${id}`)),
      catchError(this.handleError<Project>({ operation: `getProject id=${id}` }))
      );
  }

  /* PUT: update the project on the server */
updateProject(project: Project): Observable<any> {
  return this.http.put(this.projectsUrl, project, this.httpOptions)
   .pipe(
     tap(_ => this.log(`updated project id=${project.id}`)),
     catchError(this.handleError<any>())
   )
  ;
}

  /** Log a ProjectService message with the MessageService */
  private log(message: string) {
  this.messageService.add(`ProjectService: ${message}`);
  }

  /*
 * Handle Http operation that failed.
 * Let the app continue.
 * @param operation - name of the operation that failed
 * @param result - optional value to return as the observable result
 */
  private handleError<T>({ operation = 'operation', result }: { operation?: string; result?: T; } = {}) {
    return (error: any): Observable<T> => {

    // TODO: send the error to remote logging infrastructure
    console.error(error); // log to console instead

    // TODO: better job of transforming error for user consumption
    this.log(`${operation} failed: ${error.message}`);

    // Let the app keep running by returning an empty result.
    return of(result as T);
    };
  }

  /** POST: add a new project to the server */
  addProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.projectsUrl, project, this.httpOptions).pipe(
      tap((newProject: Project) => this.log(`added project w/ id=${newProject.id}`)),
      catchError(this.handleError<Project>())
    );
  }

    /** DELETE: delete the project from the server */
  deleteProject(project: Project | number): Observable<Project> {
    const id = typeof project === 'number' ? project : project.id;
    const url = `${this.projectsUrl}/${id}`;

    return this.http.delete<Project>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted project id=${id}`)),
      catchError(this.handleError<Project>())
    );
  }

  /* GET Projects whose name contains search term */
searchProjects(term: string): Observable<Project[]> {
  if (!term.trim()) {
    // if not search term, return empty project array.
    return of([]);
  }
  return this.http.get<Project[]>(`${this.projectsUrl}/?name=${term}`).pipe(
    tap(x => x.length ?
       this.log(`found Projects matching "${term}"`) :
       this.log(`no Projects matching "${term}"`)),
    catchError(this.handleError<Project[]>())
  );
}
}
