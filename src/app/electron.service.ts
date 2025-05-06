// electron.service.ts
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

interface ElectronAPI {
  sendMessage: (channel: string, data: any) => void;
  receiveMessage: (channel: string, func: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

@Injectable({
  providedIn: 'root',
})
export class ElectronService {
  private messageSubject = new Subject<string>();
  private projectResponseSubject = new Subject<any>();
  private fetchProjectSubject = new Subject<any>();

  constructor() {
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.receiveMessage('fromMain', (message: string) => {
        this.messageSubject.next(message);
      });
      window.electronAPI.receiveMessage('createProjectResponse', (response: any) => {
        this.projectResponseSubject.next(response);
      });
      window.electronAPI.receiveMessage('fetchProjectResponse', (response: any) => {
        this.fetchProjectSubject.next(response);
      });
    }
  }

  sendMessage(channel: string, data: any) {
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.sendMessage(channel, data);
    }
  }

  getMessages(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  getProjectResponses(): Observable<any> {
    return this.projectResponseSubject.asObservable();
  }

  fetchProject(projectId: string): Observable<any> {
    if (typeof window !== 'undefined' && window.electronAPI) {
      this.sendMessage('fetchProject', projectId);
      return this.fetchProjectSubject.asObservable();
    } else {
      console.error('Electron API not available');
      throw new Error('Electron API not available');
    }
  }
}