import { Component, ElementRef, ViewChild } from '@angular/core';
import { engine } from './Engine/Engine';
import { showResults } from './Models/Show';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public outputMessages: string[] = [];
  @ViewChild('inputArea') inputArea: ElementRef;

  executeCommand() {
    let commands = this.inputArea.nativeElement.value.trim().split(' ');

    let name: string;
    if (commands[0] === 'create') {
      name = commands[2];
    } else if (commands[0] === 'order') {
      name = commands[1];
    } else {
      name = commands[2];
    }

    commands = commands.map((command: string) => command.toLowerCase());

    const command = commands[0];

    switch (command) {
      case 'create':
        this.outputMessages.push(engine.create(commands, name));
        break;
      case 'order':
        this.outputMessages.push(engine.order(commands, name));
        break;
      case 'show':
        this.outputMessages.push(engine.show(commands));
        break;
      case 'end':
        this.outputMessages.push(showResults());
        break;
      default:
        this.outputMessages.push(`This command does not exist.`);
    }
  }
}
