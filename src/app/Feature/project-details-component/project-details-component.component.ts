// project-details.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { SnackBarService } from '../createProject/services/snack-bar.service';
import { ElectronService } from '../../electron.service';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './project-details-component.component.html',
  styleUrls: ['./project-details-component.component.css'],
})
export class ProjectDetailsComponent implements OnInit {
  project: any = null;
  projectId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private electronService: ElectronService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit() {
    // Get projectId from route parameters
    this.projectId = this.route.snapshot.paramMap.get('id');
    if (this.projectId) {
      this.fetchProject(this.projectId);
    } else {
      this.snackBarService.showError('No project ID provided.');
    }
  }

  async fetchProject(projectId: string) {
    try {
      this.project = await this.electronService.getProject(projectId);
    } catch (error) {
      this.snackBarService.showError('Failed to load project information.');
      console.error(error);
    }
  }
}