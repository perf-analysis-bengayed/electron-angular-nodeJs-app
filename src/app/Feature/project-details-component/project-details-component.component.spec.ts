import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDetailsComponentComponent } from './project-details-component.component';

describe('ProjectDetailsComponentComponent', () => {
  let component: ProjectDetailsComponentComponent;
  let fixture: ComponentFixture<ProjectDetailsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectDetailsComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectDetailsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
