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
    this.projectId = this.route.snapshot.paramMap.get('id');
    if (this.projectId) {
      this.fetchProject(this.projectId);
    } else {
      this.snackBarService.showError('No project ID provided.');
    }
  }

  fetchProject(projectId: string) {
    this.electronService.fetchProject(projectId).subscribe(
      (response) => {
        if (response.success) {
          this.project = response.project;
        } else {
          this.snackBarService.showError(response.error || 'Failed to load project information.');
        }
      },
      (error) => {
        this.snackBarService.showError('Failed to load project information.');
        console.error('Error fetching project:', error);
      }
    );
  }
}