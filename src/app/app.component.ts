import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ElectronService } from './electron.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  message: string = '';
  receivedMessage: string = '';

  constructor(private electronService: ElectronService) {}

  ngOnInit() {
    this.electronService.getMessages().subscribe((msg) => {
      this.receivedMessage = msg;
    });
  }

  sendMessage() {
    this.electronService.sendMessage(this.message);
    this.message = '';
  }
}