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
       (commands[1] === "unit"? engine.createUnit(commands) : engine.createResource(commands))
        break;
      case 'order':
        // engine.order()
        break;
      case 'show':
        // debugger;
        engine.show(commands);
    }
  }
}
