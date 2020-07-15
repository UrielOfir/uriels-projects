import { Component, OnInit } from '@angular/core';

import { Observable, Subject } from 'rxjs';

import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';

 import { Project } from './../Project';
 import { ProjectService } from '../project.service';

@Component({
  selector: 'app-project-search',
  templateUrl: './project-search.component.html',
  styleUrls: [ './project-search.component.css' ]
})
export class ProjectSearchComponent implements OnInit {
  projects$: Observable<Project[]>;
  private searchTerms = new Subject<string>();

  constructor(private projectService: ProjectService) {}

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.projects$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.projectService.searchProjects(term)),
    );
  }
}
