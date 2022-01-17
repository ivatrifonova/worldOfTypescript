import { Component, ElementRef, ViewChild } from '@angular/core';
import { engine } from './Engine/Engine';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public outputMessages: string[] = [];
  @ViewChild('inputArea') inputArea: ElementRef;

  constructor() {}

  executeCommand() {
    const commands = this.inputArea.nativeElement.value.split(' ');
    const command = commands[0];

    switch (command) {
      case 'create':
      engine.create(commands);
        break;
      case 'order':
        engine.order(commands);
        break;
      case 'show':
        engine.show(commands);
    }
  }
}
