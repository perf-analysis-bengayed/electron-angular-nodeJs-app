// form-project.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormProjectService } from '../../services/form-project.service';
import { SnackBarService } from '../../services/snack-bar.service';
import { UploadService } from '../../../uploadFile/services/upload-service.service';
import { UploadFileComponent } from '../../../uploadFile/components/upload-file/upload-file.component';
import { AuthService } from '../../services/auth-service.service';
import { ElectronService } from '../../../../electron.service';

@Component({
  selector: 'app-form-project',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    UploadFileComponent,
  ],
  templateUrl: './form-project.component.html',
  styleUrls: ['./form-project.component.css'],
})
export class FormProjectComponent implements OnInit, OnDestroy {
  projectForm: FormGroup;
  isSubmitting = false;
  videoSelected = false;
  videoUrl: string | null = null;
  private createSub: Subscription | null = null;
  private videoUrlSub: Subscription | null = null;

  constructor(
    private fb: FormBuilder,
    private formProjectService: FormProjectService,
    private snackBarService: SnackBarService,
    private uploadService: UploadService,
    private router: Router,
    private authService: AuthService,
    private electronService: ElectronService
  ) {
    this.projectForm = this.fb.group({
      projectName: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', Validators.maxLength(500)],
    });
  }

  ngOnInit() {
    if (!this.authService.isUser()) {
      this.snackBarService.showError('You must be logged in as a user to create a project.');
      this.router.navigate(['/login']);
      return;
    }
    this.initializeSubscriptions();
  }

  private initializeSubscriptions() {
    this.createSub = this.formProjectService.createEvent.subscribe((project) => {
      this.isSubmitting = false;
      this.snackBarService.showSuccess('Project created successfully!');
      console.log('Project Created:', project);
      this.resetForm();
      this.router.navigate([`/project/${project.id}`]);
    });

    this.videoUrlSub = this.uploadService.videoUrl$.subscribe((videoUrl) => {
      this.videoUrl = videoUrl;
      this.videoSelected = !!videoUrl;
    });

    // Optional: Listen for server response
    this.electronService.getMessages().subscribe((message) => {
      this.isSubmitting = false;
      if (message.includes('Project created')) {
        this.snackBarService.showSuccess(message);
        this.resetForm();
      } else {
        this.snackBarService.showError(message);
      }
    });
  }

  onSubmit() {
    if (this.projectForm.valid && this.videoSelected) {
      this.isSubmitting = true;
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.snackBarService.showError('No user is logged in.');
        this.isSubmitting = false;
        return;
      }

      const projectData = {
        id: uuidv4(),
        projectName: this.projectForm.value.projectName,
        description: this.projectForm.value.description,
        timestamp: new Date().toISOString(),
        userId: currentUser.id,
        createdBy: currentUser.username,
        videoUrl: this.videoUrl || 'http://url-de-video',
      };

      // Send project data to Electron main process
      if (typeof window !== 'undefined' && window.electronAPI) {
        window.electronAPI.sendMessage('createProject', JSON.stringify(projectData));
        // Optionally reset form immediately or wait for server response
        // this.resetForm();
      } else {
        console.error('Electron API not available');
        this.snackBarService.showError('Failed to communicate with the main process.');
        this.isSubmitting = false;
      }
    } else {
      if (!this.videoSelected) {
        this.snackBarService.showError('Please select a video before submitting.');
      } else if (this.projectForm.invalid) {
        this.snackBarService.showError('Please fill out all required fields.');
      }
    }
  }

  resetForm() {
    this.projectForm.reset();
    this.videoSelected = false;
    this.uploadService.setVideoUrl(null);
  }

  ngOnDestroy() {
    if (this.createSub) this.createSub.unsubscribe();
    if (this.videoUrlSub) this.videoUrlSub.unsubscribe();
  }
}