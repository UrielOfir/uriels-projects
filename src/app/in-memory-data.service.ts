import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Project } from './project';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const projects = [
      { id: 11, name: 'Lecturs' },
      { id: 12, name: 'Children' },
      { id: 13, name: 'The Magazin' },
      { id: 14, name: 'Friends' },
      { id: 15, name: 'Gym' },
      { id: 16, name: 'Studying' },
      { id: 17, name: 'Parents' },
      { id: 18, name: 'Siblings' },
      { id: 19, name: 'Be\'er Sheva' },
      { id: 20, name: 'Cleaning' }
    ];
    return {projects};
  }

  // Overrides the genId method to ensure that a project always has an id.
  // If the projects array is empty,
  // the method below returns the initial number (11).
  // if the projects array is not empty, the method below returns the highest
  // project id + 1.
  genId(projects: Project[]): number {
    return projects.length > 0 ? Math.max(...projects.map(project => project.id)) + 1 : 11;
  }
}
