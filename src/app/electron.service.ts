// electron.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface ElectronAPI {
  sendMessage: (channel: string, data: any) => void;
  receiveMessage: (channel: string, func: (...args: any[]) => void) => void;
  getProject: (projectId: string) => Promise<any>;
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

  constructor() {
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.receiveMessage('fromMain', (message: string) => {
        this.messageSubject.next(message);
      });
    }
  }

  sendMessage(message: string) {
    if (typeof window !== 'undefined' && window.electronAPI) {
      window.electronAPI.sendMessage('toMain', message);
    }
  }

  getMessages() {
    return this.messageSubject.asObservable();
  }

  // New method to fetch project information
   getProject(projectId: string): Promise<any> {
    if (typeof window !== 'undefined' && window.electronAPI) {
      try {
        const project =  window.electronAPI.getProject(projectId);
        return project;
      } catch (error) {
        console.error('Error fetching project:', error);
        throw error;
      }
    } else {
      console.error('Electron API not available');
      throw new Error('Electron API not available');
    }
  }
}