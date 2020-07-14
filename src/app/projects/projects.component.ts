import { ProjectService } from '../project.service';
import { Project } from './../Project';
import { MessageService } from '../message.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {

  selectedProject: Project;
  projects: Project[];

  constructor(private projectService: ProjectService) { }

  getProjects(): void {
    this.projectService.getProjects()
    .subscribe(projects => this.projects = projects);
  }

  ngOnInit(): void {
    this.getProjects();
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.projectService.addProject({ name } as Project)
      .subscribe(project => {
        this.projects.push(project);
      });
  }

  delete(project: Project): void {
    this.projects = this.projects.filter(h => h !== project);
    this.projectService.deleteProject(project).subscribe();
  }

}
