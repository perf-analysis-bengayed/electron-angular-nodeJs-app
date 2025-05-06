import { Injectable, EventEmitter } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { Project } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class FormProjectService {
private latestProjectId = new BehaviorSubject<string | null>(null);
createEvent = new EventEmitter<any>();

saveProject(project: any) {
  console.log('Saving project:', project);
  return {
    subscribe: (callbacks: { next: () => void; error: (err: any) => void }) => {
      callbacks.next();
      return { unsubscribe: () => {} };
    }
  };
}
getLatestProjectId() {
  return this.latestProjectId.asObservable();
}
}