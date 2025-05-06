
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { FormProjectComponent } from './Feature/createProject/components/form-project/form-project.component';
import { HttpClientModule } from '@angular/common/http';
import {UploadFileComponent } from './Feature/uploadFile/components/upload-file/upload-file.component';
import { ProjectDetailsComponent } from './Feature/project-details-component/project-details-component.component';

export const routes: Routes = [
    // { path: '', component: HomeComponent, pathMatch: 'full' }, 
    { path: '', component: FormProjectComponent }, 
    { path: 'ubload/vd', component: UploadFileComponent},
    { path: 'project/:id', component: ProjectDetailsComponent }


];
@NgModule({
    imports: [RouterModule.forRoot(routes),HttpClientModule],
    exports: [RouterModule],
  })
  export class AppRoutingModule {}
