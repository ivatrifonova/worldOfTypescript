import { Component, ElementRef, ViewChild } from '@angular/core';
import {engine} from './Engine/Engine';

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
    // console.log(commands);
    // console.log(engine.createUnit(commands[2], commands[5], commands[3], commands[4]));
    console.log(engine.createResource(commands[4], commands[2], commands[3]))
    // debugger;
    const command = commands[0];
    switch (command) {
      default:
        break;
    }
  }
}
